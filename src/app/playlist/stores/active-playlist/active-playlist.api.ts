import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AngularFire } from 'angularfire2';
import { VideoService } from 'app/video';
import { PlaylistOwnerService } from '../../services/playlist-owner'


@Injectable()
export class ActivePlaylistApiService {
  uriPrefix = '/dev';

  constructor(
    protected af: AngularFire,
    protected playlistOwner: PlaylistOwnerService,
    protected store: Store<any>,
    protected video: VideoService
  ) { }

  activate(playlist): Observable<any> {
    return this.playlistOwner.get()
      .do(console.log)
      .switchMap(ownerId => this.af.database
        .object(`${this.uriPrefix}/${ownerId}/active/playlist`)
        .update(playlist)
      );
  }

  init(): Observable<any> {
    // this.route.params.subscribe(console.log);
    return this.playlistOwner.get()
      .do(console.log)
      .switchMap(ownerId => this.af.database
        .object(`${this.uriPrefix}/${ownerId}/active/playlist`)
      )
      .take(1); // Only first time, and no more. later will be handled by activate()
  }
}
