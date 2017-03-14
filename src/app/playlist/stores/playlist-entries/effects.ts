import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/forkJoin';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { ActivePlaylistService } from '../active-playlist';
import { PlaylistEntriesApiService } from './api';
import * as a from './actions';

import { Playlist } from '../../interfaces';
import { Video } from 'app/video';


@Injectable()
export class PlaylistEntriesEffects {
  constructor(
    protected actions: Actions,
    protected af: AngularFire,
    protected playlist: ActivePlaylistService,
    protected api: PlaylistEntriesApiService
  ) {}



  // private videos:any = [];

  // private startTime;

  // private _start() {
  //   this.startTime = (new Date()).getTime();
  // }

  // private _stop() {
  //   const elapsed = (new Date()).getTime() - this.startTime;
  //   this.startTime = null;
  //   return elapsed/1000+"s";
  // }


  @Effect()
  load$ = this.actions
    .ofType(a.ActionTypes.LOAD)
    .switchMap((action: a.LoadPlaylistEntriesAction) => this.api.load()
      .map(entries => new a.LoadPlaylistEntriesSuccessAction(entries))
      .catch(error => Observable.of(new a.LoadPlaylistEntriesErrorAction(error))));


  @Effect()
  create$ = this.actions
    .ofType(a.ActionTypes.CREATE)
    .switchMap(({ payload }) => this.api.create(payload)
      .map(video => new a.CreatePlaylistEntrySuccessAction(video))
      .catch(error => Observable.of(new a.CreatePlaylistEntryErrorAction(error))));


  @Effect()
  delete$ = this.actions
    .ofType(a.ActionTypes.DELETE)
    .switchMap(({ payload }) => this.api.delete(payload)
      .map(result => new a.DeletePlaylistEntrySuccessAction(result))
      .catch(error => Observable.of(new a.DeletePlaylistEntryErrorAction(error)))
    );

  // @Effect()
  // update$ = this.actions
  //   .ofType(a.ActionTypes.UPDATE)
  //   .switchMap(({ type, payload }) => this.playlist.get().take(1)
  //     .map((playlist: Playlist) => this.af.database
  //       .object(this._ref(playlist, <Video>payload))
  //       .update(<Video>payload)) // need both playlist and entry
  //     .map(result => new a.UpdatePlaylistEntrySuccessAction(result))
  //     .catch(error => Observable.of(new a.UpdatePlaylistEntryErrorAction(error)))
  //   )

  // @Effect()
  // reorder$ = this.actions
  //   .ofType(ActionTypes.REORDER)
  //   .switchMap(({ type, payload }) => this.playlist.get()
  //     .map((playlist: Playlist) => this.af.database
  //       .list(this._ref(playlist))
  //   ));
}
