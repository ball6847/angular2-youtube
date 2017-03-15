import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/switch';
import 'rxjs/add/observable/fromPromise';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Playlist } from '../../interfaces';
import { AngularFire } from 'angularfire2';



@Injectable()
export class PlaylistListApiService {
  uriPrefix = '/dev';

  constructor(protected af: AngularFire) { }


  fetch(): Observable<any> {
    return this.af.auth
      .switchMap(auth => this.af.database
        .list(`${this.uriPrefix}/playlists`, {
          query: {
            orderByChild: 'uid',
            equalTo: auth.uid
          }
        })
      );
  }


  /**
   * Create a new playlist
   *
   * @param name
   */
  create(playlist: Playlist): Observable<any> {
    return this.af.auth
      .switchMap(auth => this.af.database
        .object(`${this.uriPrefix}/playlists/${playlist.id}`)
        .update(Object.assign({}, playlist, {uid: auth.uid}))
      );
  }

  /**
   * FirebaseObjectObservable.update() won't return an observable
   * We, need to Observable.of() to transform it to observable on the fly
   *
   * @param playlist
   */
  update(playlist: Playlist): Observable<any> {
    return Observable.of(
      this.af.database
        .object(`${this.uriPrefix}/playlists/${playlist.id}`)
        .update(playlist)
    );
  }

  /**
   * FirebaseObjectObservable.remove() won't return an observable, as well
   * We, need to Observable.of() to transform it to observable on the fly
   *
   * @param playlist
   */
  delete(playlist: Playlist): Observable<any> {
    return Observable.of(
      this.af.database
        .object(`${this.uriPrefix}/playlists/${playlist.id}`)
        .remove()
    );
  }
}
