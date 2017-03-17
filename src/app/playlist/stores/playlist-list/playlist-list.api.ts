import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/switch';
import 'rxjs/add/observable/fromPromise';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Playlist } from '../../interfaces';
import { AngularFire } from 'angularfire2';
import { PlaylistOwnerService } from '../../services/playlist-owner';



@Injectable()
export class PlaylistListApiService {
  uriPrefix = '/dev';

  constructor(protected af: AngularFire, protected playlistOwner: PlaylistOwnerService) { }

  fetch(): Observable<any> {
    return this.playlistOwner.get()
      .switchMap(ownerId => this.af.database
        .list(`${this.uriPrefix}/playlists`, {
          query: {
            orderByChild: 'uid',
            equalTo: ownerId
          }
        })
      );
  }

  /**
   * Only allow owner to create/update playlist
   */
  private getAuth() {
    return this.playlistOwner.get()
      .switchMap(ownerId => this.af.auth
        .map(auth => Object.assign({}, { ownerId: ownerId, auth: auth })))
      .filter(({ ownerId, auth }) => ownerId == auth.uid)
      .map(({ auth }) => auth);
  }


  /**
   * Create a new playlist
   *
   * @param name
   */
  create(playlist: Playlist): Observable<any> {
    return this.getAuth()
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
    // return Observable.of(
    //   this.af.database
    //     .object(`${this.uriPrefix}/playlists/${playlist.id}`)
    //     .update(playlist)
    // );
    return this.getAuth()
      .switchMap(auth => this.af.database
        .object(`${this.uriPrefix}/playlists/${playlist.id}`)
        .update(playlist)
        .map(result => result)
      );
  }

  /**
   * FirebaseObjectObservable.remove() won't return an observable, as well
   * We, need to Observable.of() to transform it to observable on the fly
   *
   * @param playlist
   */
  delete(playlist: Playlist): Observable<any> {
    // return Observable.of(
    //   this.af.database
    //     .object(`${this.uriPrefix}/playlists/${playlist.id}`)
    //     .remove()
    // );
    return this.getAuth()
      .switchMap(auth => this.af.database
        .object(`${this.uriPrefix}/playlists/${playlist.id}`)
        .remove()
        .map(result => result)
      );
  }
}
