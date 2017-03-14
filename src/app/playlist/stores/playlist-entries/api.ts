import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { BenchmarkService } from 'app/../modules/ngb68-utils'
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
  public videos = [];

  private debug = true;

  /**
   * constructor
   *
   * @param af
   * @param playlist
   */
  constructor(
    protected af: AngularFire,
    protected playlist: ActivePlaylistService,
    protected benchmark: BenchmarkService
  ) { }

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
      .do(p => console.log("playlist loaded:", p))
      .take(1)
      .do(() => this.benchmark.start(checkpoint))
      .switchMap(playlist => this.af.database.list(this._ref(playlist)).take(1))
      .do(() => this._verbose(checkpoint, this.benchmark.stop(checkpoint)))
  }

  /**
   * Get active playlist push small video key to it
   * then do async push of complete video to another ref
   *
   * @param action
   */
  create(video: Video): Observable<Video> {
    const videoRef = {
      uuid: video.uuid,
      videoId: video.videoId,
      title: video.title,
      duration: video.duration
    };

    return this.playlist.get()
      .take(1)
      .map(playlist => this.af.database.object(this._ref(playlist, video)).update(videoRef))
      .map(() => videoRef); // map to something useful to subscriber
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
}
