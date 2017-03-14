import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/forkJoin';
import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { ActivePlaylistService } from '../active-playlist';
import * as a from './actions';

import { Playlist } from '../../interfaces';
import { Video } from 'app/video';


/**
 * Service for remote api (firebase)
 */
@Injectable()
export class PlaylistEntriesApiService {
  /**
   * firebase ref prefix, useful for development
   */
  private prefix = '/dev';

  /**
   * local in-memory cache
   */
  private videos: Video[] = [];

  /**
   * constructor
   *
   * @param af
   * @param playlist
   */
  constructor(protected af: AngularFire, protected playlist: ActivePlaylistService) { }

  /**
   * create url reference for firebase
   *
   * @param playlist
   * @param video
   * @return string
   */
  private _ref(playlist: Playlist, video?: Video): string {
    let ref = `${this.prefix}/entries/${playlist.id}`;

    if (video)
      ref += `/${video.$key}`;

    return ref;
  }

  /**
   * Load video entries of the current playlist
   *
   * @return Observable<Video[]>
   */
  load(): Observable<Video[]> {
    return this.playlist.get()
      .take(1)
      .switchMap(playlist => this.af.database.list(this._ref(playlist)).take(1))
      .switchMap(this._videoMapper);
  }

  /**
   * Try to use cache first, then firebase
   */
  private _videoMapper(entry: Video) {
    if (this.videos[entry.uuid])
      return Observable.of(this.videos[entry.uuid]);

    return this.af.database.object(`/dev/videos/${entry.videoId}`)
      .take(1) // do we really need this ?
      .map((video: Video) => Object.assign({}, video, entry)) // merge with original videoRef
      .do((video: Video) => this.videos[video.uuid] = video) // cache locally
  }

  /**
   * Get active playlist push small video key to it
   * then do async push of complete video to another ref
   *
   * @param action
   */
  create(video: Video): Observable<Video> {
    const videoRef = { uuid: video.uuid, videoId: video.videoId };
    const videoFull = Object.assign({}, video, { uuid: null });
    const videoUrl = `${this.prefix}/videos/${video.videoId}`;

    return this.playlist.get()
      .take(1)
      .map(playlist => this.af.database.list(this._ref(playlist)).push(videoRef))
      .do(() => this.af.database.object(videoUrl).update(videoFull))
      .map(() => video); // map to something useful to subscriber
  }


  /**
   * Remove entry from active playlist
   *
   * @param video
   */
  delete(video: Video): Observable<any> {
    const options = {
      query: {
        orderByChild: 'uuid',
        equalTo: video.uuid
      }
    };

    return this.playlist.get()
      .take(1)
      .map((playlist) => this.af.database.list(this._ref(playlist), options))
      .do(collection => collection.take(1)
        .subscribe(entries => entries.forEach(entry => collection.remove(entry.$key))));
  }




}
