import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import 'rxjs/add/operator/map';
import {AppState} from "../../shared/app-state.service";


@Injectable()
export class VideoService {

  // @TODO create VideoServiceConfig instead
  key = 'AIzaSyAARhzDEdAwaIYKelgTmVa8Nez5sLKjBcM';

  constructor(private http: Http, private appState: AppState) { }

  fetchVideos(query: string) {
    query = encodeURIComponent(query);
    return this.http
      .get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=50&type=video&key=${this.key}`)
      .map(response => response.json())
  }

  // @TODO: we may need to cache on firebase or localstorage to save api calls
  fetchVideo(videoId: string) {
    videoId = encodeURIComponent(videoId);
    return this.http
      .get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${this.key}`)
      .map(response => response.json().items[0]);
  }

}
