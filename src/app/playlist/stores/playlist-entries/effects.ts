import 'rxjs/add/observable/of';

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { PlaylistEntriesApiService } from './api';
import * as a from './actions';


@Injectable()
export class PlaylistEntriesEffects {
  constructor(
    protected actions: Actions,
    protected api: PlaylistEntriesApiService
  ) {}


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


  @Effect()
  reorder$ = this.actions
    .ofType(a.ActionTypes.REORDER)
    .switchMap(({ payload }) => this.api.reorder(payload)
      .map(result => new a.ReorderPlaylistEntriesSuccessAction(result))
      .catch(error => Observable.of(new a.ReorderPlaylistEntriesErrorAction(error)))
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

}
