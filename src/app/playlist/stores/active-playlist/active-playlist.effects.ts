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
  PLAYLIST_ACTIVE_LIST_ENTRIES,
  PlaylistActivatedFulfilledAction,
  PlaylistActiveInitFulfilledAction,
  PlaylistActiveInitFailedAction,
  PlaylistActiveListEntriesAction,
  PlaylistActiveListEntriesFulfilledAction,
  PlaylistActiveListEntriesFailedAction
} from './active-playlist.actions';

import { LoadPlaylistEntriesAction } from '../playlist-entries'

@Injectable()
export class ActivePlaylistEffects {
  constructor(
    protected actions$: Actions,
    protected store: Store<any>,
    protected activePlaylistApi: ActivePlaylistApiService
  ) { }


  @Effect()
  init$ = this.actions$
    .ofType(PLAYLIST_ACTIVE_INIT)
    .switchMap(() => this.activePlaylistApi.init()
      // firebase will pull any update on /{user}/active/playlist automatically
      // thus the PlaylistActiveInitFulfilledAction() will be fired anytime those update arrived
      .map(playlist => new PlaylistActiveInitFulfilledAction(playlist))
      .do(value => this.store.dispatch(new LoadPlaylistEntriesAction()))
      .catch(error => Observable.of(new PlaylistActiveInitFailedAction()))
    );


  @Effect()
  activate$ = this.actions$
    .ofType(PLAYLIST_ACTIVATED)
    .switchMap(({ payload }) => this.activePlaylistApi.activate(payload)
      .map(playlist => new PlaylistActivatedFulfilledAction(playlist))
    );

  @Effect()
  listEntries$ = this.actions$
    .ofType(PLAYLIST_ACTIVE_LIST_ENTRIES)
    .switchMap(() => this.activePlaylistApi.listEntries()
      .map(playlists => new PlaylistActiveListEntriesFulfilledAction(playlists))
      .catch(error => Observable.of(new PlaylistActiveListEntriesFailedAction(error)))
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
