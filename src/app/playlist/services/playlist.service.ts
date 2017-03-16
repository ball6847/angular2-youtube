import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/combineLatest';
import * as _ from 'lodash';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { UUID } from 'angular2-uuid';
import { YoutubePlayerService } from 'ng2-youtube-player/ng2-youtube-player';
import { Playlist, PlaylistState } from '../interfaces';
import { PlaylistListService, ActivePlaylistService, PlaylistStateService } from '../stores';
import { CreatePlaylistEntryAction, DeletePlaylistEntryAction } from '../stores/playlist-entries/actions';

// @todo find a way to separate these external services
import { AppService } from "../../shared/service";
import { Video } from "../../video";
import { IApplicationState } from '../../shared/interfaces';


@Injectable()
export class PlaylistService {
  // @TODO: use firebase
  private list$: Observable<Playlist[]>;
  private active$: Observable<Playlist>;
  private state$: Observable<PlaylistState>;
  private entries$: Observable<Video[]>;

  // internal data we need to work with
  private active: Playlist;
  private state = new PlaylistState();

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
    private player: YoutubePlayerService,
    protected playlistList: PlaylistListService,
    protected activePlaylist: ActivePlaylistService,
    protected playlistState: PlaylistStateService
  ) {
    this._setState({ playing: false, video: null });
    this._provideStore();
    this._setupSubscriptions();
  }


  /**
  * Bind service's properties to ApplicationStore
  */
  private _provideStore() {
    this.list$ = this.playlistList.get();
    this.active$ = this.activePlaylist.get();
    this.state$ = this.store.select(state => state.playlistState);
    this.entries$ = this.store.select(state => state.playlistEntries)
      .map(entries => _.orderBy(entries, ['ordering'], ['asc']));
  }

  // -------------------------------------------------------------------

  /**
   * Setup service's internal handler
   * Mostly subscribe to observables and do something useful in service.
   */
  private _setupSubscriptions() {
    // play video as video changed, or clear playing video
    // also skip first emit, since we are not ready yet
    // this.store.select(state => state.playlistState.video)
    this.state$
      .skip(1)
      .subscribe(state => {
        // prevent prop not exists in null error
        if (!this.state.video)
          this.state.video = new Video();

        const video = state.video ? state.video : { videoId: null, uuid: null };

        // playing state changed ?
        if (this.state.playing != state.playing)
          state.playing
            ? this.appService.player.playVideo()
            : this.appService.player.pauseVideo();

        // video entry changed ?
        if (video.uuid != this.state.video.uuid)
          this.player.playVideo({ id: video }, this.appService.player);

        // clone state to keep state tracking
        this.state = Object.assign({}, state);
      });

    this.active$
      .subscribe(playlist => {
        this.active = playlist;
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
    this._setState({ shuffle: !this.state.shuffle });
  }

  // -------------------------------------------------------------------

  /**
   * Enable or disable loop play
   */
  public toggleLoop(): void {
    this._setState({ loop: !this.state.loop });
  }

  // -------------------------------------------------------------------

  /**
   * Play or pause currently playing video
   */
  public togglePlay(): void {
    this.entries$
      .take(1)
      .filter(entries => entries.length > 0)
      .combineLatest(this.state$.take(1), (entries, state) => [entries, state])
      .subscribe(combined => {
        const [entries, state] = [<Video[]>combined[0], <PlaylistState>combined[1]]

        const video = state.video;

        if (!video && entries.length) {
          return this.next();
        }

        // toggle playig video, or set state to not play
        // this.state.playing = video ? !this.state.playing : false;
        state.playing = video ? !state.playing : false;

        this._setState(state);
      });

    if (!this.active.entries.length) return;
  }

  // --------------------------------------------------------------------

  /**
   * Play a given video
   *
   * @param video
   */
  public play(video: Video): void {
    this.entries$
      .take(1)
      .filter(entries => entries.length > 0)
      .subscribe(() => {
        this._setState({ video: video });
      });
  }

  // -------------------------------------------------------------------

  /**
   * Play random video
   */
  public playRandom(): void {
    this.entries$
      .take(1)
      .filter(entries => entries.length > 0)
      .combineLatest(this.state$.take(1), (entries, state) => [entries, state])
      .subscribe(combined => {
        const [entries, state] = [<Video[]>combined[0], <PlaylistState>combined[1]]

        // to do a realistic shuffle we need to remove playingVideo from the list
        // or just keep them all if there is no video playing
        // @TODO: we may need to keep track a list of recently playing videos, to get more realistic result

        const newEntries = entries.filter(item => !state.video || state.video.uuid != item.uuid);
        const video = newEntries[Math.floor(Math.random() * newEntries.length)];
        this._setState({ video: video });
      });
  }

  // -------------------------------------------------------------------

  /**
   * Play next video
   */
  public next(): void {
    this.entries$
      .take(1)
      .filter(entries => entries.length > 0)
      .combineLatest(this.state$.take(1), (entries, state) => [entries, state])
      .subscribe(combined => {
        const [entries, state] = [<Video[]>combined[0], <PlaylistState>combined[1]]

        if (state.shuffle)
          return this.playRandom();

        let index = state.video ? _.findIndex(entries, { uuid: state.video.uuid }) + 1 : 0;

        if (index >= entries.length) {
          index = 0;
        }

        this.play(entries[index]);
      });
  }

  // -------------------------------------------------------------------

  /**
   * Play the previous video
   */
  public prev(): void {
    this.entries$
      .take(1)
      .filter(entries => entries.length > 0)
      .combineLatest(this.state$.take(1), (entries, state) => [entries, state])
      .subscribe(combined => {
        const [entries, state] = [<Video[]>combined[0], <PlaylistState>combined[1]]

        if (state.shuffle)
          return this.playRandom();

        let index = state.video ? _.findIndex(entries, { uuid: state.video.uuid }) -1 : -1;

        if (index < 0) {
          index = entries.length - 1;
        }

        this.play(entries[index]);
      });
  }

  // -------------------------------------------------------------------

  /**
   * Stop currently playing videop
   */
  public stop(): void {
    this.appService.player.stopVideo();

    this._setState({ playing: false });
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

    this.entries$
      .take(1)
      .map(entries => {
        const lastItem = _.maxBy(entries, 'ordering');

        // create copy of video
        let vdo = Object.assign({}, video);
        vdo.uuid = UUID.UUID();
        vdo.duration = { text: '0.00', seconds: 0 };
        vdo.ordering = lastItem ? lastItem.ordering + 1 : 1;

        return vdo;
      })
      .subscribe(video => this.store.dispatch(new CreatePlaylistEntryAction(video)));



    // add entry to playlist immediately
    // this.store.dispatch(new CreatePlaylistEntryAction(vdo));
  }

  // -------------------------------------------------------------------

  /**
   * Remove video from active playlist
   *
   * @param video
   */
  public dequeue(video: Video): void {
    this.entries$
      .take(1)
      .combineLatest(this.state$.take(1), (entries, state) => [entries, state])
      .subscribe(combined => {
        const [entries, state] = [<Video[]>combined[0], <PlaylistState>combined[1]]

        if (entries.length > 1) {
          if (state.video && state.video.uuid === video.uuid)
            this.next();
          return this.store.dispatch(new DeletePlaylistEntryAction(video));
        }

        if (entries.length > 0)
          this.store.dispatch(new DeletePlaylistEntryAction(video));
          // this.activePlaylist.dequeue(video);

        this._setState({ video: null });
      });
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
          this._setState({ playing: true });
        }
        break;
      case YT.PlayerState.PAUSED:
        this._setState({ playing: false });
        break;
      case YT.PlayerState.ENDED:
        this.next();
        break;
    }
  }

  // -------------------------------------------------------------------
  // PRIVATE METHOD
  // -------------------------------------------------------------------

  /**
   * Util function, dispatch updated state to ApplicationStore
   */
  private _setState(playlistState: Partial<PlaylistState>) {
    this.playlistState.setState(playlistState);
  }

  // -------------------------------------------------------------------


}
