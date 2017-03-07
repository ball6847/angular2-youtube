import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { YoutubePlayerService } from 'ng2-youtube-player/ng2-youtube-player';
import { tassign } from 'tassign';
import { AppService } from "../../../app.service";
import { Video, VideoService } from "../../../video";
import { IApplicationState } from '../../../shared/interfaces';
import { Playlist, PlaylistState } from '../interfaces';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as UUID from 'uuid-js';
import '../../../operators';

// Actions comsumed by this service
import { PlaylistStateChangeAction } from '../reducers'


@Injectable()
export class PlaylistService {
  // @TODO: use firebase
  private list$: Observable<Playlist[]>;
  private active$: Observable<Playlist>;
  private state$: Observable<PlaylistState>;
  private entries$: Observable<Video[]>;

  // internal data we need to work with
  private list: Playlist[];
  private active: Playlist;
  private entries: Video[];
  private state: PlaylistState;

  /**
   * constructor
   *
   * @param store
   * @param appService
   * @param videoService
   * @param playerService
   */
  constructor(
    private store: Store<IApplicationState>,
    private appService: AppService,
    private videoService: VideoService,
    private playerService: YoutubePlayerService
  ) {
    // always start with no active video, state.playing = false
    this.store.dispatch({ type: 'PLAYLIST_ENTRIES_CLEAR_ACTIVATED', payload: null });
    this.store.dispatch(
      new PlaylistStateChangeAction({ playing: false, video: null })
    );

    this._provideStore();
    this._setupSubscriptions();
  }



  /**
   * Get all playlist in store as observable
   */
  public getList(): Observable<Playlist[]> {
    return this.list$;
  }

  /**
   * Get active playlist's entries observable
   */
  public getEntries(): Observable<Video[]> {
    return this.entries$;
  }

  /**
   * Get playlist state observable
   */
  public getState(): Observable<PlaylistState> {
    return this.state$;
  }

  /**
   * Get active playlist observable
   */
  public getActive(): Observable<Playlist> {
    return this.active$;
  }

  /**
   * Create a new playlist and giving it a name
   * @param name
   */
  public createPlaylist(name: string) {
    const playlist: Playlist = {
      id: UUID.create().toString(),
      name: name,
      entries: []
    };

    this.store.dispatch({ type: 'PLAYLIST_CREATED', payload: playlist });
    this.loadPlaylist(playlist);
  }

  /**
   * Rename a given playlist to another name
   *
   * @param playlist
   * @param name
   */
  public renamePlaylist(playlist: Playlist, name: string) {
    const newPlaylist = Object.assign({}, playlist, { name: name });
    this.store.dispatch({ type: 'PLAYLIST_UPDATED', payload: newPlaylist });
    this.store.dispatch({ type: 'PLAYLIST_ACTIVE_CHANGED', payload: newPlaylist });
  }

  /**
   * Remove a given playlist from store
   *
   * @param playlist
   */
  public deletePlaylist(playlist: Playlist): void {
    this.store.dispatch({ type: 'PLAYLIST_DELETED', payload: playlist });
    this.store.dispatch({ type: 'PLAYLIST_ACTIVE_CHANGED', payload: undefined });
  }

  /**
   * Load a given playlist to workspace
   *
   * @param playlist
   */
  public loadPlaylist(playlist: Playlist) {
    this.store.dispatch({ type: 'PLAYLIST_ACTIVE_CHANGED', payload: playlist });
    this.store.dispatch({ type: 'PLAYLIST_ENTRIES_LOADED', payload: playlist.entries });
  }

  /**
   * Enable or disable shuffle play
   */
  public toggleShuffle(): void {
    this.state.shuffle = !this.state.shuffle;
    this._dispatchState();
  }

  /**
   * Enable or disable loop play
   */
  public toggleLoop(): void {
    this.state.loop = !this.state.loop;
    this._dispatchState();
  }

  /**
   * Play or pause currently playing video
   */
  public togglePlay(): void {
    if (!this.entries.length) return;

    const video = this._getPlayingVideo();

    if (!video && this.entries.length) {
      return this.next();
    }

    // toggle playig video, or set state to not play
    // this.state.playing = video ? !this.state.playing : false;
    this.state.playing = video ? !this.state.playing : false;
    this._dispatchState();

    if (this.state.playing) {
      this.appService.player.playVideo();
    } else {
      this.appService.player.pauseVideo();
    }
  }

  // --------------------------------------------------------------------

  /**
   * Play a given video
   *
   * @param video
   */
  public play(video: Video): void {
    if (!this.entries.length)
      return;

    this.store.dispatch({ type: 'PLAYLIST_ENTRIES_CHILD_ACTIVATED', payload: video });
    this.store.dispatch(
      new PlaylistStateChangeAction({ video: video })
    );
  }

  /**
   * Play random video
   */
  public playRandom(): void {
    if (!this.entries.length)
      return;

    const playingVideo = this._getPlayingVideo();

    // to do a realistic shuffle we need to remove playingVideo from the list
    // or just keep them all if there is no video playing
    // @TODO: we may need to keep track a list of recently playing videos, to get more realistic result
    let entries = this.entries.filter(item => !playingVideo || playingVideo.uuid != item.uuid);
    const video = entries[Math.floor(Math.random()*entries.length)];
    this.play(video);
  }

  /**
   * Play next video
   */
  public next(): void {
    if (!this.entries.length)
      return;

    if (this.state.shuffle)
      return this.playRandom();

    // play video next to the currently playing video
    let index = this._getPlayingVideoIndex() + 1;

    if (index >= this.entries.length) {
      // if (!this.state.loop)
      //   return this.nowPlaying$.next(undefined);
      index = 0;
    }
    this.play(this.entries[index]);
  }

  /**
   * Play the previous video
   */
  public prev(): void {
    if (!this.entries.length)
      return;

    if (this.state.shuffle)
      return this.playRandom();

    // play video right before the currently playing video
    let index = this._getPlayingVideoIndex() - 1;

    // or, move to last entry of the list
    if (index < 0)
      index = this.entries.length - 1;

    this.play(this.entries[index]);
  }

  /**
   * Stop currently playing videop
   */
  public stop(): void {
    this.appService.player.stopVideo();
    this.store.dispatch(
      new PlaylistStateChangeAction({ playing: false })
    );
  }

  /**
   * Add video to active playlist
   *
   * @param video
   */
  public enqueue(video: Video): void {
    if (!this.active)
      this.createPlaylist('Untitled');

    let vdo = Object.assign({}, video);

    this.videoService.fetchVideo(vdo.videoId)
      .subscribe(v => {
        let d = moment.duration(v.contentDetails.duration);

        vdo = tassign(vdo, {
          uuid: UUID.create().toString(),
          duration: {
            text: this._formatDuration(d.get('hours'), d.get('minutes'), d.get('seconds')),
            seconds: d.asSeconds()
          }
        });

        this.store.dispatch({ type: "PLAYLIST_ENTRIES_CHILD_ADDED", payload: vdo });
      });
  }

  /**
   * Remove video from active playlist
   *
   * @param video
   */
  public dequeue(video: Video): void {
    if (this.entries.length > 1) {
      if (this.state.video && this.state.video.uuid === video.uuid)
        this.next();

      return this.store.dispatch({ type: "PLAYLIST_ENTRIES_CHILD_REMOVED", payload: video });
    }

    if (this.entries.length > 0)
      this.store.dispatch({ type: "PLAYLIST_ENTRIES_CHILD_REMOVED", payload: video });

    this.store.dispatch(
      new PlaylistStateChangeAction({ video: null })
    );
  }

  /**
   * Use this function to sync state between YoutubePlayerService and PlaylistService
   *
   * @param playerState
   */
  public onPlayerStateChange(playerState: any): void {
    switch (playerState.data) {
      case YT.PlayerState.PLAYING:
        // youtube emit play event on next video
        if (this.state.playing != true) {
          this.state.playing = true;
          this._dispatchState();
        }
        break;
      case YT.PlayerState.PAUSED:
        this.state.playing = false;
        this._dispatchState();
        break;
      case YT.PlayerState.ENDED:
        this.next();
        break;
    }
  }

  // -------------------------------------------------------------------
  // PRIVATE METHOD

  /**
  * Bind service's properties to ApplicationStore
  */
  private _provideStore() {
    this.list$ = this.store.select('playlistList') as Observable<Playlist[]>;
    this.active$ = this.store.select('playlistActive') as Observable<Playlist>;
    this.state$ = this.store.select('playlistState') as Observable<PlaylistState>;
    this.entries$ = this.store.select('playlistEntries') as Observable<Video[]>;
  }

  /**
   * Setup service's internal handler
   * Mostly subscribe to observables and do something useful in service.
   */
  private _setupSubscriptions() {
    // play video as video changed, or clear playing video
    // also skip first emit, since we are not ready yet
    this.store.select(s => s.playlistState.video)
      .skip(1)
      .subscribe(video => {
        const vdo = video ? video : { videoId: null };
        this.playerService.playVideo({ id: vdo }, this.appService.player);
      });

    // we also need tracking of state inside of service

    this.state$
      .subscribe(state => this.state = Object.assign({}, state));

    this.active$
      .subscribe(playlist => this.active = playlist);

    this.entries$
      .subscribe(entries => {
        this.entries = entries;

        // no entries, means no play
        this.store.dispatch(
          new PlaylistStateChangeAction({ playing: false })
        );

        // push entries back to source playlist
        // this will cause duplicate dispation but nothing serius here
        if (this.active && this.active.entries != entries) {
          this.active.entries = entries;
          this.store.dispatch({ type: 'PLAYLIST_UPDATED', payload: this.active });
        }
      });
  }

  /**
   * [DEPRECATED] Util function, get currently playing video
   */
  private _getPlayingVideo(): Video {
    return this.state.video;
  }

  /**
   * Util function, get currently playing video's index of the playlist
   * Useful for determining which video to play next
   */
  private _getPlayingVideoIndex(): number {
    if (!this.state.video) return -1;
    return _.findIndex(this.entries, { uuid: this.state.video.uuid });
  }

  /**
   * [DEPRECATED] Util function, dispatch updated state to ApplicationStore
   */
  private _dispatchState() {
    this.store.dispatch(
      new PlaylistStateChangeAction(this.state)
    );
  }

  /**
   * Util function, generate video duration in readable format
   * Example: 4:58, 1:05:15
   *
   * @param h hours returned from momentObject.get('hours')
   * @param m minutes returned from momentObject.get('minutes')
   * @param s seconds returned from momentObject.get('seconds)
   */
  private _formatDuration(h: number, m: number, s: number): string {
    let duration = [];

    if (h) {
      duration.push(h);
      duration.push(('00' + m).slice(-2));
    } else {
      duration.push(m)
    }

    duration.push(('00' + s).slice(-2))

    return duration.join(':');
  }
}
