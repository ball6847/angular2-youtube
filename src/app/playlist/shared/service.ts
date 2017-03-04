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
  private playlists$: Observable<Playlist[]>;
  private playlist$: Observable<Playlist>;
  private playlistState$: Observable<PlaylistState>;
  private entries$ = new PlaylistEntriesObservable();
  private nowPlaying$ = new PlaylistNowPlayingObservable();
  private _state: PlaylistState;

  constructor(
    private store: Store<AppState>,
    private appService: AppService,
    private videoService: VideoService,
    private playerService: YoutubePlayerService
  ) {
    this.playlists$ = store.select('playlists') as Observable<Playlist[]>;
    this.playlist$ = store.select('activePlaylist') as Observable<Playlist>;
    this.playlistState$ = store.select('playlistControlState') as Observable<PlaylistState>;

    // we also need tracking of state inside of service
    this.playlistState$
      .subscribe(state => this._state = Object.assign({}, state));


    // always mark video as playing when nowPlaying changed
    this.nowPlaying$.subscribe(video => {
      this.entries$.getValue()
        .map(v => v.playing = false);

      // initialValue can be undefined
      if (video) {
        video.playing = true;
      }
    });
  }

  playlists(): Observable<Playlist[]> {
    return this.playlists$;
  }

  create(name: string) {
    const playlist = new Playlist();

    playlist.id = UUID.create().toString();
    playlist.name = name;

    this.store.dispatch({ type: 'PLAYLIST_CREATED', payload: playlist });

    this.load(playlist);
  }

  rename(playlist: Playlist, name: string) {
    playlist.name = name;

    this.store.dispatch({ type: 'PLAYLIST_UPDATED', payload: playlist });
  }

  delete(playlist: Playlist): void {
    this.store.dispatch({ type: 'PLAYLIST_DELETED', payload: playlist });
    this.store.dispatch({ type: 'PLAYLIST_ACTIVE_CHANGED', payload: undefined });
  }

  entries(): PlaylistEntriesObservable {
    return this.entries$;
  }

  nowPlaying(): PlaylistNowPlayingObservable {
    return this.nowPlaying$;
  }

  state(): Observable<PlaylistState> {
    return this.playlistState$;
  }

  playlist(): Observable<Playlist> {
    return this.playlist$;
  }

  // --------------------------------------------------------------------

  load(playlist: Playlist) {
    this.store.dispatch({ type: 'PLAYLIST_ACTIVE_CHANGED', payload: playlist });
    this.entries$.next(playlist.entries);
  }

  toggleShuffle(): void {
    this._state.shuffle = !this._state.shuffle;
    this._dispatchState();
  }

  toggleLoop(): void {
    this._state.loop = !this._state.loop;
    this._dispatchState();
  }

  togglePlay(): void {
    this._state.playing = !this._state.playing;
    this._dispatchState();

    if (this._state.playing) {
      this.appService.player.playVideo();
    } else {
      this.appService.player.pauseVideo();
    }
  }

  // --------------------------------------------------------------------

  play(index: number): void {
    if (this.outOfBound(index)) {
      return;
    }

    const video = this.getVideoByIndex(index);

    this.playerService.playVideo({ id: video.videoId }, this.appService.player);
    this.nowPlaying$.next(video);
  }

  playRandom(): void {
    if (this.totalEntries() === 0) {
      return;
    }

    const entries = this.entries$.getValue();
    const video = entries[Math.floor(Math.random() * entries.length)];

    this.playerService.playVideo({ id: video.videoId }, this.appService.player);
    this.nowPlaying$.next(video);
  }

  next(): void {
    // @TODO: check if currently in pause state
    if (this._state.shuffle) {
      return this.playRandom();
    }
    const video = this.nowPlaying$.getValue();
    let index = this.indexOf(video) + 1;
    // end of playlist, stop or back to first entry
    if (index >= this.totalEntries()) {
      if (!this._state.loop) {
        return this.nowPlaying$.next(undefined);
      }
      index = 0;
    }
    this.play(index);
  }


  prev(): void {
    // @TODO: check if currently in pause state
    if (this._state.shuffle) {
      return this.playRandom();
    }
    const video = this.nowPlaying$.getValue();
    let index = this.indexOf(video) - 1;
    // reset if it's end of list
    if (index < 0) {
      index = this.totalEntries() - 1;
    }
    this.play(index);
  }

  stop(): void {
    this._state.playing = false;
    this.store.dispatch({ type: 'PLAYLIST_CONTROL_STATE_CHANGED', payload: this._state });

    this.appService.player.stopVideo();
  }

  enqueue(video: Video): void {
    // no active playlist available, create it on-the-fly
    // if (!this.playlist$.value.id) {
    //   this.create('Untitled');
    // }

    // get video's additional detail from youtube api before enlist
    this.videoService.fetchVideo(video.videoId)
      .subscribe(v => {
        let d = moment.duration(v.contentDetails.duration);
        video.duration = {
          text: this.formatDuration(
            d.get('hours'),
            d.get('minutes'),
            d.get('seconds')
          ),
          seconds: d.asSeconds()
        };
        // note, we use Object.assign() to avoid reference to the same videos in the playlist
        this.entries$.push(Object.assign({}, video));
      });
  }

  dequeue(index: number): void {
    const video = this.getVideoByIndex(index);
    const playingVideo = this.nowPlaying$.getValue();

    // the video is playing and still have more videos to play, move to next song the remove
    if (this.totalEntries() > 1) {
      // go to next entry before the entry itself deleted
      if (video === playingVideo) {
        this.next();
      }

      return this.entries$.remove(video);
    }

    // has one left, remove it first
    if (this.totalEntries() > 0) {
      this.entries$.remove(video);
    }

    // load empty player
    this.playerService.playVideo({ id: { videoId: null } }, this.appService.player);

    // reset nowPlaying to nothing
    this.nowPlaying$.next(undefined);
  }

  totalEntries(): number {
    return this.entries$.getValue().length;
  }

  onPlayerStateChange(playerState: any): void {
    switch (playerState.data) {
      case YT.PlayerState.PLAYING:
        // youtube emit play event on next video
        if (this._state.playing != true) {
          this._state.playing = true;
          this._dispatchState();
        }
        break;
      case YT.PlayerState.PAUSED:
        this._state.playing = false;
        this._dispatchState();
        break;
      case YT.PlayerState.ENDED:
        this.next();
        break;
    }
  }

  // -----------------------------------------------------------------------

  private _dispatchState() {
    this.store.dispatch({ type: 'PLAYLIST_CONTROL_STATE_CHANGED', payload: this._state });
  }

  private getVideoByIndex(index: number): Video {
    return this.entries$.getValue()[index];
  }

  private outOfBound(index: number): boolean {
    return index >= this.totalEntries();
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

  private indexOf(entry: Video) {
    return Array.prototype.indexOf.call(this.entries$.getValue(), entry);
  }
}
