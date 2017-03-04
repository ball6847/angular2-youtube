import { Injectable } from '@angular/core';
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
import { Playlist } from './model';


@Injectable()
export class PlaylistService {
  // @TODO: use firebase
  private list$ = new PlaylistListObservable();
  private playlist$ = new PlaylistObservable();
  private entries$ = new PlaylistEntriesObservable();
  private nowPlaying$ = new PlaylistNowPlayingObservable();
  private state$ = new PlaylistStateObservable();

  constructor(
    private appService: AppService,
    private videoService: VideoService,
    private playerService: YoutubePlayerService
  ) {
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

  list() {
    return this.list$;
  }

  create(name: string) {
    const playlist = new Playlist();

    playlist.id = UUID.create().toString();
    playlist.name = name;

    this.list$.push(playlist);
    this.load(playlist);
  }

  delete(): void {
    return;
  }

  entries(): PlaylistEntriesObservable {
    return this.entries$;
  }

  nowPlaying(): PlaylistNowPlayingObservable {
    return this.nowPlaying$;
  }

  state(): PlaylistStateObservable {
    return this.state$;
  }

  playlist(): PlaylistObservable {
    return this.playlist$;
  }

  // --------------------------------------------------------------------

  load(playlist: Playlist) {
    this.playlist$.next(playlist);
    this.entries$.next(playlist.entries);
  }

  toggleShuffle(): void {
    const state = this.state$.getValue();

    state.shuffle = !state.shuffle;
    this.state$.next(state);
  }

  toggleLoop(): void {
    const state = this.state$.getValue();

    state.loop = !state.loop;
    this.state$.next(state);
  }

  togglePlay(): void {
    const state = this.state$.getValue();

    state.playing = !state.playing;
    this.state$.next(state);

    if (state.playing) {
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
    const state = this.state$.getValue();
    // @TODO: check if currently in pause state
    if (state.shuffle) {
      return this.playRandom();
    }
    const video = this.nowPlaying$.getValue();
    let index = this.indexOf(video) + 1;
    // end of playlist, stop or back to first entry
    if (index >= this.totalEntries()) {
      if (!state.loop) {
        return this.nowPlaying$.next(undefined);
      }
      index = 0;
    }
    this.play(index);
  }


  prev(): void {
    const state = this.state$.getValue();
    // @TODO: check if currently in pause state
    if (state.shuffle) {
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
    const state = this.state$.getValue();
    state.playing = false;
    this.state$.next(state);
    this.appService.player.stopVideo();
  }

  enqueue(video: Video): void {
    // var playlists = this.playlistStore.getPlaylists().getValue();

    // console.log(playlists)

    // get video's additional detail from youtube api before enlist
    this.videoService.fetchVideo(video.videoId)
      .subscribe((v) => {
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
    const state = this.state$.getValue();

    switch (playerState.data) {
      case YT.PlayerState.PLAYING:
        state.playing = true;
        this.state$.next(state);
        break;
      case YT.PlayerState.PAUSED:
        state.playing = false;
        this.state$.next(state);
        break;
      case YT.PlayerState.ENDED:
        this.next();
        break;
    }
  }

  // -----------------------------------------------------------------------

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
