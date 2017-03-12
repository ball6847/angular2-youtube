import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { ActivePlaylistApiService } from './active-playlist.api';

import {
  PLAYLIST_ACTIVATED,
  PLAYLIST_ACTIVE_INIT,
  PlaylistActivatedFulfilledAction,
  PlaylistActiveInitFulfilledAction,
  PlaylistActiveInitFailedAction
} from './active-playlist.actions';

@Injectable()
export class ActivePlaylistEffects {
  constructor(
    protected actions$: Actions,
    protected activePlaylistApi: ActivePlaylistApiService
  ) { }


  @Effect()
  init$ = this.actions$
    .ofType(PLAYLIST_ACTIVE_INIT)
    .switchMap(() => this.activePlaylistApi.init()
      .map(playlist => new PlaylistActiveInitFulfilledAction(playlist))
      .catch(error => Observable.of(new PlaylistActiveInitFailedAction()))
    );


  @Effect()
  activate$ = this.actions$
    .ofType(PLAYLIST_ACTIVATED)
    .switchMap(({ payload }) => this.activePlaylistApi.activate(payload)
      .map(playlist => new PlaylistActivatedFulfilledAction(playlist))
    );


  // @Effect()
  // create$ = this.actions$
  //   .ofType(PLAYLIST_CREATED)
  //   .switchMap(({ payload }) => this.playlistApi.create(payload)
  //     .map(playlist => new PlaylistCreatedFulfilledAction(playlist))
  //     .catch(error => Observable.of(new PlaylistCreatedFailedAction(error)))
  //   );

  // @Effect()
  // update$ = this.actions$
  //   .ofType(PLAYLIST_UPDATED)
  //   .switchMap(({ payload }) => this.playlistApi.update(payload)
  //     .map(playlist => new PlaylistUpdatedFulfilledAction(playlist))
  //     .catch(error => Observable.of(new PlaylistUpdatedFailedAction(error)))
  //   );

  // @Effect()
  // delete$ = this.actions$
  //   .ofType(PLAYLIST_DELETED)
  //   .switchMap(({ payload }) => this.playlistApi.delete(payload)
  //     .map(playlist => new PlaylistDeletedFulfilledAction(playlist))
  //     .catch(error => Observable.of(new PlaylistDeletedFailedAction(error)))
  //   );
}
