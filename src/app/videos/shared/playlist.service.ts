import { Injectable } from '@angular/core';
import { AppState } from "../../shared/app-state.service";
import { Video } from "../shared/video.model";
import { VideoService } from "../shared/video.service";
import { ReplaySubject } from 'rxjs/ReplaySubject';

// @TODO use angular2-moment instead
import * as moment from 'moment';

@Injectable()
export class PlaylistService {
  // @TODO: use firebase later
  private _items: Video[] = [];
  private _items$ = new ReplaySubject<Video[]>(1);
  private _index: number;
  private shuffle = false;

  constructor(private videoService: VideoService, private appState: AppState) {
  }

  index() {
    return this._index;
  }

  items(): ReplaySubject<Video[]> {
    return this._items$;
  }

  play(index: number) {
    let video: Video = this._items[index];
    this._index = index;
    if (video == this.appState.activeVideo) {
      // we need to force replay
      // so we need youtube player api, not just an iframe
      // @TODO use player api
    } else {
      this.appState.activeVideo = video;
    }
  }

  next() {

  }

  prev() {

  }

  add(video: Video): void {
    // get video's additional detail
    this.videoService.fetchVideo(video.videoId)
      .subscribe(v => {
        let d = moment.duration(v.contentDetails.duration);

        video.duration = {
          text: this._formatDuration(d.get('hours'), d.get('minutes'), d.get('seconds')),
          seconds: d.asSeconds()
        };

        this._items.push(video);
        this._notify();
      });
  }

  remove(index: number): void {
    this._items.splice(index, 1);
    this._notify();
  }

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

  private _notify() {
    this._items$.next(this._items);
  }
}
