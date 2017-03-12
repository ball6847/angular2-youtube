import * as _ from 'lodash';
import * as moment from 'moment';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { UUID } from 'angular2-uuid';
import { tassign } from 'tassign';
import { YoutubePlayerService } from 'ng2-youtube-player/ng2-youtube-player';
import { Playlist, PlaylistState } from '../interfaces';
import { PlaylistListService, ActivePlaylistService, PlaylistStateChangedAction } from '../stores';

// @todo find a way to separate these external services
import { AppService } from "../../app.service";
import { Video, VideoService } from "../../video";
import { IApplicationState } from '../../shared/interfaces';


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

  // -------------------------------------------------------------------

  /**
   * constructor
   *
   * @param store
   * @param appService
   * @param video
   * @param player
   */
  constructor(
    private store: Store<IApplicationState>,
    private appService: AppService,
    private video: VideoService,
    private player: YoutubePlayerService,
    protected playlistList: PlaylistListService,
    protected activePlaylist: ActivePlaylistService
  ) {
    // always start with no active video, state.playing = false
    this.activePlaylist.deactivate();

    this.store.dispatch(
      new PlaylistStateChangedAction({ playing: false, video: null })
    );

    this._provideStore();
    this._setupSubscriptions();
  }


  /**
  * Bind service's properties to ApplicationStore
  */
  private _provideStore() {
    this.list$ = this.playlistList.get();
    this.active$ = this.activePlaylist.get();
    this.state$ = this.store.select('playlistState') as Observable<PlaylistState>;
    this.entries$ = this.store.select(state => state.playlistActive.entries) as Observable<Video[]>;
  }

  // -------------------------------------------------------------------

  /**
   * Setup service's internal handler
   * Mostly subscribe to observables and do something useful in service.
   */
  private _setupSubscriptions() {
    // play video as video changed, or clear playing video
    // also skip first emit, since we are not ready yet
    this.store.select(state => state.playlistState.video)
      .skip(1)
      .subscribe(video => {
        const vdo = video ? video : { videoId: null };
        this.player.playVideo({ id: vdo }, this.appService.player);
      });

    // we also need tracking of state inside of service

    this.state$
      .subscribe(state => this.state = Object.assign({}, state));

    this.active$
      .subscribe(playlist => {
        this.active = playlist;
        // load entries back to original playlist pool
        // this will need to change to firebase implement
        this.playlistList.update(playlist);
      });
  }

  // -------------------------------------------------------------------

  /**
   * Get active playlist's entries observable
   */
  public getEntries(): Observable<Video[]> {
    return this.entries$;
  }

  // -------------------------------------------------------------------

  /**
   * Get playlist state observable
   */
  public getState(): Observable<PlaylistState> {
    return this.state$;
  }

  // -------------------------------------------------------------------

  /**
   * Enable or disable shuffle play
   */
  public toggleShuffle(): void {
    this.state.shuffle = !this.state.shuffle;
    this._dispatchState();
  }

  // -------------------------------------------------------------------

  /**
   * Enable or disable loop play
   */
  public toggleLoop(): void {
    this.state.loop = !this.state.loop;
    this._dispatchState();
  }

  // -------------------------------------------------------------------

  /**
   * Play or pause currently playing video
   */
  public togglePlay(): void {
    if (!this.active.entries.length) return;

    const video = this._getPlayingVideo();

    if (!video && this.active.entries.length) {
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
    if (!this.active.entries.length)
      return;

    this.store.dispatch(
      new PlaylistStateChangedAction({ video: video })
    );
  }

  // -------------------------------------------------------------------

  /**
   * Play random video
   */
  public playRandom(): void {
    if (!this.active.entries.length)
      return;

    const playingVideo = this._getPlayingVideo();

    // to do a realistic shuffle we need to remove playingVideo from the list
    // or just keep them all if there is no video playing
    // @TODO: we may need to keep track a list of recently playing videos, to get more realistic result
    let entries = this.active.entries.filter(item => !playingVideo || playingVideo.uuid != item.uuid);
    const video = entries[Math.floor(Math.random()*entries.length)];
    this.play(video);
  }

  // -------------------------------------------------------------------

  /**
   * Play next video
   */
  public next(): void {
    if (!this.active.entries.length)
      return;

    if (this.state.shuffle)
      return this.playRandom();

    // play video next to the currently playing video
    let index = this._getPlayingVideoIndex() + 1;

    if (index >= this.active.entries.length) {
      // if (!this.state.loop)
      //   return this.nowPlaying$.next(undefined);
      index = 0;
    }

    this.play(this.active.entries[index]);
  }

  // -------------------------------------------------------------------

  /**
   * Play the previous video
   */
  public prev(): void {
    if (!this.active.entries.length)
      return;

    if (this.state.shuffle)
      return this.playRandom();

    // play video right before the currently playing video
    let index = this._getPlayingVideoIndex() - 1;

    // or, move to last entry of the list
    if (index < 0)
      index = this.active.entries.length - 1;

    this.play(this.active.entries[index]);
  }

  // -------------------------------------------------------------------

  /**
   * Stop currently playing videop
   */
  public stop(): void {
    this.appService.player.stopVideo();

    this.store.dispatch(
      new PlaylistStateChangedAction({ playing: false })
    );
  }

  // -------------------------------------------------------------------

  /**
   * Add video to active playlist
   *
   * @param video
   */
  public enqueue(video: Video): void {
    if (!this.active.id)
      this.playlistList.create('Untitled');

    // create copy of video
    let vdo = Object.assign({}, video);
    vdo.uuid = UUID.UUID();
    vdo.duration = { text: '0.00', seconds: 0 };

    // add entry to playlist immediately
    this.activePlaylist.enqueue(vdo);

    // and update it afterward
    this.video.fetchVideo(vdo.videoId)
      .subscribe(v => {
        let d = moment.duration(v.contentDetails.duration);

        vdo.duration = {
          text: this._formatDuration(d.get('hours'),  d.get('minutes'), d.get('seconds')),
          seconds: d.asSeconds()
        };

        this.activePlaylist.updateEntry(vdo);
      });
  }

  // -------------------------------------------------------------------

  /**
   * Remove video from active playlist
   *
   * @param video
   */
  public dequeue(video: Video): void {
    if (this.active.entries.length > 1) {
      if (this.state.video && this.state.video.uuid === video.uuid)
        this.next();

      return this.activePlaylist.dequeue(video);
    }

    if (this.active.entries.length > 0)
      this.activePlaylist.dequeue(video);

    this.store.dispatch(
      new PlaylistStateChangedAction({ video: null })
    );
  }

  // -------------------------------------------------------------------

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
  // -------------------------------------------------------------------


  // -------------------------------------------------------------------

  /**
   * [DEPRECATED] Util function, get currently playing video
   */
  private _getPlayingVideo(): Video {
    return this.state.video;
  }

  // -------------------------------------------------------------------

  /**
   * Util function, get currently playing video's index of the playlist
   * Useful for determining which video to play next
   */
  private _getPlayingVideoIndex(): number {
    if (!this.state.video)
      return -1;

    return _.findIndex(this.active.entries, { uuid: this.state.video.uuid });
  }

  // -------------------------------------------------------------------

  /**
   * [DEPRECATED] Util function, dispatch updated state to ApplicationStore
   */
  private _dispatchState() {
    this.store.dispatch(
      new PlaylistStateChangedAction(this.state)
    );
  }

  // -------------------------------------------------------------------

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
