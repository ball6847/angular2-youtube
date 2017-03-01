import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import { AppState } from "../../shared/app-state.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';


@Injectable()
export class VideoService {

  // @TODO create VideoServiceConfig instead
  key = 'AIzaSyAARhzDEdAwaIYKelgTmVa8Nez5sLKjBcM';

  constructor(private http: Http, private appState: AppState) { }

  rxSearch(query: Observable<string>) {
    return query.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.search(term));
  }

  search(query: string) {
    query = encodeURIComponent(query);
    return this.http
      .get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=50&type=video&key=${this.key}`)
      .map(response => response.json());
  }

  // @TODO: we may need to cache on firebase or localstorage to save api calls
  fetchVideo(videoId: string) {
    videoId = encodeURIComponent(videoId);
    return this.http
      .get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${this.key}`)
      .map(response => response.json().items[0]);
  }

}
