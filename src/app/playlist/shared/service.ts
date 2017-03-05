import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { YoutubePlayerService } from 'ng2-youtube-player';
import * as moment from 'moment';
import * as UUID from 'uuid-js';
import { AppService } from "../../app.service";
import { Video, VideoService } from "../../video";
import {
  PlaylistEntriesObservable,
  PlaylistNowPlayingObservable,
  PlaylistStateObservable,
  PlaylistListObservable,
  PlaylistObservable
} from "./observable";
import { Playlist, PlaylistState } from './model';
import { AppState } from '../../app.store';

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

  // @TODO, change to ngrx store
  private nowPlaying$ = new PlaylistNowPlayingObservable();

  constructor(
    private store: Store<AppState>,
    private appService: AppService,
    private videoService: VideoService,
    private playerService: YoutubePlayerService
  ) {
    // pick state fro store
    this.list$ = store.select('playlistList') as Observable<Playlist[]>;
    this.active$ = store.select('playlistActive') as Observable<Playlist>;
    this.state$ = store.select('playlistState') as Observable<PlaylistState>;
    this.entries$ = store.select('playlistEntries') as Observable<Video[]>;

    // we also need tracking of state inside of service
    this.state$
      .subscribe(state => this.state = Object.assign({}, state));
    this.active$
      .subscribe(playlist => this.active = playlist);
    this.entries$
      .subscribe(entries => {
        this.entries = entries;
        if (this.active && this.active.entries != entries) {
          this.active.entries = entries;
          // this will cause duplicate dispatchtion but nothing serius here
          this.store.dispatch({ type: 'PLAYLIST_UPDATED', payload: this.active });
        }
      });


    // always mark video as playing when nowPlaying changed
    // this.nowPlaying$.subscribe(video => {
    //   this.entries$.getValue()
    //     .map(v => v.playing = false);
    //
    //   // initialValue can be undefined
    //   if (video) {
    //     video.playing = true;
    //   }
    // });
  }

  // --------------------------------------------------------------------
  // all observables

  getList(): Observable<Playlist[]> {
    return this.list$;
  }

  getEntries(): Observable<Video[]> {
    return this.entries$;
  }

  getState(): Observable<PlaylistState> {
    return this.state$;
  }

  getActive(): Observable<Playlist> {
    return this.active$;
  }

  // @TODO change to ngrx/store
  getNowPlaying(): PlaylistNowPlayingObservable {
    return this.nowPlaying$;
  }

  // --------------------------------------------------------------------
  // working with playlist collections

  createPlaylist(name: string) {
    const playlist: Playlist = {
      id: UUID.create().toString(),
      name: name,
      entries: []
    };
    this.store.dispatch({ type: 'PLAYLIST_CREATED', payload: playlist });
    this.loadPlaylist(playlist);
  }

  renamePlaylist(playlist: Playlist, name: string) {
    const newPlaylist = Object.assign({}, playlist, { name: name });
    this.store.dispatch({ type: 'PLAYLIST_UPDATED', payload: newPlaylist });
    this.store.dispatch({ type: 'PLAYLIST_ACTIVE_CHANGED', payload: newPlaylist });
  }

  deletePlaylist(playlist: Playlist): void {
    this.store.dispatch({ type: 'PLAYLIST_DELETED', payload: playlist });
    this.store.dispatch({ type: 'PLAYLIST_ACTIVE_CHANGED', payload: undefined });
  }

  // --------------------------------------------------------------------
  // working with activePlaylist and playlistControl

  loadPlaylist(playlist: Playlist) {
    this.store.dispatch({ type: 'PLAYLIST_ACTIVE_CHANGED', payload: playlist });
    this.store.dispatch({ type: 'PLAYLIST_ENTRIES_LOADED', payload: playlist.entries });
  }

  toggleShuffle(): void {
    this.state.shuffle = !this.state.shuffle;
    this.dispatchState();
  }

  toggleLoop(): void {
    this.state.loop = !this.state.loop;
    this.dispatchState();
  }

  togglePlay(): void {
    this.state.playing = !this.state.playing;
    this.dispatchState();

    if (this.state.playing) {
      this.appService.player.playVideo();
    } else {
      this.appService.player.pauseVideo();
    }
  }

  // --------------------------------------------------------------------

  //@TODO change to ngrx/store
  play(video: Video): void {
    this.store.dispatch({ type: 'PLAYLIST_ENTRIES_CHILD_ACTIVATED', payload: video });
    this.playerService.playVideo({ id: video.videoId }, this.appService.player);
    this.nowPlaying$.next(video);
  }

  playRandom(): void {
    if (!this.entries.length)
      return;
    const video = this.entries[Math.floor(Math.random() * this.entries.length)];
    this.play(video);
  }

  //@TODO change to ngrx/store
  next(): void {
    if (this.state.shuffle)
      return this.playRandom();
    const video = this.getPlayingVideo();
    let index = this.entries.indexOf(video) + 1;
    if (index >= this.entries.length) {
      // if (!this.state.loop)
      //   return this.nowPlaying$.next(undefined);
      index = 0;
    }
    this.play(this.entries[index]);
  }

  //@TODO change to ngrx/store
  prev(): void {
    if (this.state.shuffle)
      return this.playRandom();
    const video = this.getPlayingVideo();
    let index = this.entries.indexOf(video) - 1;
    if (index < 0)
      index = this.entries.length - 1;
    this.play(this.entries[index]);
  }

  stop(): void {
    this.state.playing = false;
    this.store.dispatch({ type: 'PLAYLIST_CONTROL_STATE_CHANGED', payload: this.state });
    this.appService.player.stopVideo();
  }

  enqueue(video: Video): void {
    const vdo = Object.assign({}, video);
    if (!this.active)
      this.createPlaylist('Untitled');
    this.videoService.fetchVideo(vdo.videoId)
      .subscribe(v => {
        let d = moment.duration(v.contentDetails.duration);
        vdo.duration = {
          text: this.formatDuration(d.get('hours'), d.get('minutes'), d.get('seconds')),
          seconds: d.asSeconds()
        };
        vdo.uuid = UUID.create().toString();
        this.store.dispatch({ type: "PLAYLIST_ENTRIES_CHILD_ADDED", payload: vdo });
      });
  }

  // @TODO change to ngrx/store
  dequeue(video: Video): void {
    const playingVideo = this.nowPlaying$.getValue();
    // have many video left, also move to next entry before removing
    if (this.entries.length > 1) {
      if (video.uuid === playingVideo.uuid) this.next();
      this.store.dispatch({ type: "PLAYLIST_ENTRIES_CHILD_REMOVED", payload: video });
      return;
    }
    // this is the only one left
    if (this.entries.length > 0)
      this.store.dispatch({ type: "PLAYLIST_ENTRIES_CHILD_REMOVED", payload: video });
    // load null player
    this.playerService.playVideo({ id: { videoId: null } }, this.appService.player);
    this.nowPlaying$.next(undefined);
  }

  // --------------------------------------------------------------------
  // state sync handler with youtube player

  onPlayerStateChange(playerState: any): void {
    switch (playerState.data) {
      case YT.PlayerState.PLAYING:
        // youtube emit play event on next video
        if (this.state.playing != true) {
          this.state.playing = true;
          this.dispatchState();
        }
        break;
      case YT.PlayerState.PAUSED:
        this.state.playing = false;
        this.dispatchState();
        break;
      case YT.PlayerState.ENDED:
        this.next();
        break;
    }
  }

  // -----------------------------------------------------------------------
  // internal utils

  private getPlayingVideo() {
    const videos = this.entries.filter(video => video.playing);
    return videos.length ? videos[0] : null;
  }

  private dispatchState() {
    this.store.dispatch({ type: 'PLAYLIST_CONTROL_STATE_CHANGED', payload: this.state });
  }

  private formatDuration(h: number, m: number, s: number): string {
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
