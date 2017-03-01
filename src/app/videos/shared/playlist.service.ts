import { Injectable } from '@angular/core';
import { AppState } from "../../shared/app-state.service";
import { Video } from "../shared/video.model";
import { VideoService } from "../shared/video.service";
import { YoutubePlayerService } from 'ng2-youtube-player';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// @TODO use angular2-moment instead
import * as moment from 'moment';

export class PlaylistEntriesObservable extends BehaviorSubject<Video[]> {
  constructor() {
    super([]);
  }
}

export class PlaylistNowPlayingObservable extends BehaviorSubject<Video> {
  constructor() {
    super(undefined);
  }
}


@Injectable()
export class PlaylistService {
  private shuffle = false;
  private loop = true;
  private player: YT.Player;

  // @TODO: use firebase
  private entries$ = new PlaylistEntriesObservable();
  private nowPlaying$ = new PlaylistNowPlayingObservable();

  constructor(
    private appState: AppState,
    private videoService: VideoService,
    private playerService: YoutubePlayerService,
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

  setPlayer(player: YT.Player): void {
    this.player = player;
  }

  entries(): PlaylistEntriesObservable {
    return this.entries$;
  }

  nowPlaying(): PlaylistNowPlayingObservable {
    return this.nowPlaying$;
  }

  setShuffle(shuffle: boolean): void {
    this.shuffle = shuffle;
  }

  setLoop(loop: boolean): void {
    this.loop = loop;
  }

  play(index: number): void {
    if (this.outOfBound(index)) {
      return;
    }
    const video = this.getVideoByIndex(index);
    this.playerService.playVideo({ id: video.videoId }, this.appState.player);
    this.nowPlaying$.next(video);
  }

  playRandom(): void {
    if (this.totalEntries() === 0) {
      return;
    }
    const entries = this.entries$.getValue();
    const video = entries[Math.floor(Math.random() * entries.length)];
    this.playerService.playVideo({ id: video.videoId }, this.appState.player);
    this.nowPlaying$.next(video);
  }

  next(): void {
    // @TODO: check if currently in pause state
    if (this.shuffle) {
      return this.playRandom();
    }
    const video = this.nowPlaying$.getValue();
    let index = this.indexOf(video) + 1;
    // end of playlist, stop or back to first entry
    if (index >= this.totalEntries()) {
      if (!this.loop) {
        return this.nowPlaying$.next(undefined);
      }
      index = 0;
    }
    this.play(index);
  }

  prev(): void {
    // @TODO: check if currently in pause state
    if (this.shuffle) {
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

  enqueue(video: Video): void {
    const enqueue = (v) => {
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
      this.entries$.getValue()
        .push(Object.assign({}, video));
    }
    // get video's additional detail from youtube api before enlist
    this.videoService.fetchVideo(video.videoId)
      .subscribe(enqueue);
  }

  dequeue(index: number): void {
    const video = this.getVideoByIndex(index);
    const entries = this.entries$.getValue();
    const playingVideo = this.nowPlaying$.getValue();
    // the video is playing and still have more videos to play, move to next song the remove
    if (this.totalEntries() > 1) {
      // go to next entry before the entry itself deleted
      if (video === playingVideo) {
        this.next();
      }
      entries.splice(index, 1);
      return;
    }
    // has one left, remove it first
    if (this.totalEntries() > 0) {
      entries.splice(index, 1);
    }
    // load empty player
    this.playerService.playVideo({ id: { videoId: null } }, this.appState.player);
    // reset nowPlaying to nothing
    this.nowPlaying$.next(undefined);
  }

  totalEntries(): number {
    return this.entries$.getValue().length;
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
