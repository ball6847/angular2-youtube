import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ActivePlaylistApiService } from './active-playlist.api';

import {
  PLAYLIST_ACTIVATED,
  PLAYLIST_ACTIVE_INIT,
  PlaylistActivatedFulfilledAction,
  PlaylistActiveInitFulfilledAction,
  PlaylistActiveInitFailedAction,
} from './active-playlist.actions';

import { LoadPlaylistEntriesAction } from '../playlist-entries/actions'

@Injectable()
export class ActivePlaylistEffects {
  constructor(
    protected actions$: Actions,
    protected store: Store<any>,
    protected activePlaylistApi: ActivePlaylistApiService
  ) { }


  /**
   *
   * firebase will pull any update on /{user}/active/playlist automatically
   * thus the PlaylistActiveInitFulfilledAction() will be fired anytime those update arrived
   */
  @Effect()
  init$ = this.actions$
    .ofType(PLAYLIST_ACTIVE_INIT)
    .switchMap(() => this.activePlaylistApi.init()
      .map(playlist => new PlaylistActiveInitFulfilledAction(playlist))
      // .do(() => setTimeout(() => this.store.dispatch(new LoadPlaylistEntriesAction()), 1))
      .catch(error => Observable.of(new PlaylistActiveInitFailedAction()))
    );

  // @Effect()
  // initSuccess$ = this.actions$
  //   .ofType(PLAYLIST_ACTIVE_INIT_FULFILLED)
  //   .do(playlist => console.log(playlist))
  //   .map(() => new LoadPlaylistEntriesAction());


  /**
   * Replace active playlist stored on the server
   *
   * The tricky part is where we dispatch LoadPlaylistEntriesAction immediately
   * before the active playlist occured
   *
   * This make UI load faster than subscribing for /active/playlist changed from the server
   */
  @Effect()
  activate$ = this.actions$
    .ofType(PLAYLIST_ACTIVATED)
    .do(() => this.store.dispatch(new LoadPlaylistEntriesAction()))
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
