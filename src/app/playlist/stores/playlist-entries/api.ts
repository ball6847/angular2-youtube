import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { BenchmarkService } from 'app/../modules/ngb68-utils'
import { environment } from 'app/../environments/environment';
import { ActivePlaylistService } from '../active-playlist';
import { Playlist, PlaylistEntry } from '../../interfaces';
import { Video, VideoService } from 'app/video';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

/**
 * Service for remote api (firebase)
 */
@Injectable()
export class PlaylistEntriesApiService {
  /**
   * firebase ref prefix, useful for development
   */
  private prefix = '/dev';

  private debug = !environment.production;

  /**
   * constructor
   *
   * @param af
   * @param playlist
   */
  constructor(
    protected af: AngularFire,
    protected benchmark: BenchmarkService,
    protected playlist: ActivePlaylistService,
    protected store: Store<any>, // use any for now
    protected youtube: VideoService,
  ) {}

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
      ref += `/${video.uuid}`;

    return ref;
  }

  private _verbose(message: string, data?: any) {
    if (!this.debug) return;

    const info = [this.constructor.name+':', message];

    if (data) info.push(data)

    console.info.apply(console, info);
  }

  /**
   * Load video entries of the current playlist
   *
   * @return Observable<Video[]>
   */
  load(): Observable<Video[]> {
    const checkpoint = 'load_playlist_entries';
    return this.playlist.get()
      .do(p => this._verbose("playlist loaded:", p))
      .take(1)
      .do(() => this.benchmark.start(checkpoint))
      // .debounceTime(1000)
      // .distinctUntilChanged()
      .switchMap(playlist => this.af.database
        .list(this._ref(playlist))
        // .debounceTime(1000)
        // .distinctUntilChanged()
      )
      .do(() => this._verbose(checkpoint, this.benchmark.stop(checkpoint)))
  }

  /**
   * Resolve video duration using youtube service then push to firebase
   *
   * @param video
   */
  create(video: Video): Observable<Video> {
    const videoRef: PlaylistEntry = {
      uuid: video.uuid,
      videoId: video.videoId,
      title: video.title,
      duration: video.duration,
      ordering: video.ordering
    };

    return this.playlist.get()
      .take(1)
      // stream result in videoRef observable
      .switchMap(playlist => this.youtube.fetchVideo(video.videoId)
        // change stream to formatted video duration
        .map(result => this.youtube.formatDuration(result))
        // add duration to videoRef then change stream to videoRef
        .map(duration => Object.assign({}, videoRef, { duration: duration }))
        // add to firebase, we don't care the result for now,
        // do operator is fine here, current stream is videoRef
        .do(videoRef => this.af.database
          .object(this._ref(playlist, video))
          .update(videoRef)))
  }

  /**
   * Remove entry from active playlist
   *
   * @param video
   */
  delete(video: Video): Observable<any> {
    return this.playlist.get()
      .take(1)
      .map((playlist) => this.af.database
        .object(this._ref(playlist, video))
        .remove())
      .do(result => this._verbose(`Deleted`, video.uuid))
      .map(() => video) // in case of error we can restore it
  }

  reorder(entries: Video[]): Observable<Video[]> {
    return this.playlist.get()
      .take(1)
      // update them all
      .map(playlist => entries.forEach(video => this.af.database
        .object(this._ref(playlist, video))
        .update({ ordering: video.ordering })))
      // just return them back
      .map(() => entries);
  }
}
