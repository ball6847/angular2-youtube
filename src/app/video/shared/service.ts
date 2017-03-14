import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { Video, VideoDuration } from './model';
import * as moment from 'moment';

// @TODO: we may need to cache on firebase or localstorage to save api calls
// @TODO: create VideoServiceConfig instead of hard code apikey
@Injectable()
export class VideoService {
  readonly key = 'AIzaSyAARhzDEdAwaIYKelgTmVa8Nez5sLKjBcM';
  readonly delay = 200;
  readonly endpoint = {
    search: 'https://www.googleapis.com/youtube/v3/search',
    videos: 'https://www.googleapis.com/youtube/v3/videos'
  };

  constructor(private http: Http) {}

  rxSearch(query: Observable<string>): Observable<Video[]> {
    return query
      .debounceTime(this.delay)
      .distinctUntilChanged()
      .switchMap(term => this.search(term));
  }

  search(query: string = ''): Observable<Video[]> {
    return this.http
      .get(`${this.endpoint.search}?part=snippet&q=${encodeURIComponent(query)}&maxResults=50&type=video&key=${this.key}`)
      .map(response => response.json().items.map(item => new Video(item)));
  }

  fetchVideo(videoId: string): Observable<any> {
    return this.http
      .get(`${this.endpoint.videos}?id=${encodeURIComponent(videoId)}&part=contentDetails&key=${this.key}`)
      .map(response => response.json().items[0]);
  }


  /**
   * Util function, generate video duration in readable format
   * Example: 4:58, 1:05:15
   */
  formatDuration(vdo: any): VideoDuration {
    let d = moment.duration(vdo.contentDetails.duration);
    let [hours, minutes, seconds] = [d.get('hours'), d.get('minutes'), d.get('seconds')];
    let duration = [];

    if (hours) {
      duration.push(hours);
      duration.push(('00' + minutes).slice(-2));
    } else {
      duration.push(minutes)
    }

    duration.push(('00' + seconds).slice(-2))

    return {
      text: duration.join(':'),
      seconds: d.asSeconds()
    };
  }
}
