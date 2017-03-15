import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AngularFire } from 'angularfire2';

import { VideoService } from 'app/video';

@Injectable()
export class ActivePlaylistApiService {
  uriPrefix = '/dev';

  constructor(protected af: AngularFire, protected store: Store<any>, protected video: VideoService) { }

  activate(playlist): Observable<any> {
    return this.af.auth
      .filter(state => !!state)
      .switchMap(auth => this.af.database
        .object(`${this.uriPrefix}/${auth.uid}/active/playlist`)
        .update(playlist)
      );
  }

  init(): Observable<any> {
    return this.af.auth
      .filter(state => !!state)
      .switchMap(auth => this.af.database
        .object(`${this.uriPrefix}/${auth.uid}/active/playlist`)
      )
      .take(1); // Only first time, and no more. later will be handled by activate()
  }
}
