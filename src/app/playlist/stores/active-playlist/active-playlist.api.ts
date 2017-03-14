import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/switch';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/combineLatest';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { tassign } from 'tassign';
import { Playlist } from '../../interfaces';
import { AngularFire, FirebaseListObservable } from 'angularfire2';



import { Video, VideoService } from 'app/video';

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

  private _select(takeAll = false): Observable<Playlist> {
    let observable =  this.store
      .select(state => state.playlistActive)
      .filter(playlist => !!playlist);

    if (!takeAll) {
      observable = observable.take(1)
    }

    return observable;
  }

  listEntries(): Observable<Video[]> {
    return this._select(true)
      .switchMap(playlist => this.af.database.list(`${this.uriPrefix}/entries/${playlist.id}`))
      // .skip(1)
  }

  addEntry(video: Video): void {
    this._select()
      .combineLatest(this.video.fetchVideo(video.videoId), this._combiner(video))
      .switchMap(({ playlist, video }) => this.af.database.list(`${this.uriPrefix}/entries/${playlist.id}`).push(video))
      .subscribe((newVideo) => {
        console.log(newVideo);
      });
  }

  dropEntry(video: Video) {
    this._select()
      .switchMap(playlist => this.af.database.object(`${this.uriPrefix}/entries/${playlist.id}/${video.$key}`).remove())
      .switchMap(() => Observable.of(video)) // return something useful to reducer
      .subscribe(what => {
        // console.log(what);
      });
  }

  private _combiner(video) {
    return (playlist, vdo) => {
      return { playlist: playlist, video: video };
    }
  }

}
