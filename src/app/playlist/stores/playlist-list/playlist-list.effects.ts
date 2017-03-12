import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { PlaylistListService } from './playlist-list.service';
import { PlaylistListApiService } from './playlist-list.api';
import {
  PLAYLIST_LOADED,
  PLAYLIST_CREATED,
  PLAYLIST_UPDATED,
  PLAYLIST_DELETED,
  PlaylistLoadedFulfilledAction,
  PlaylistLoadedFailedAction,
  PlaylistCreatedFulfilledAction,
  PlaylistCreatedFailedAction,
  PlaylistUpdatedFulfilledAction,
  PlaylistUpdatedFailedAction,
  PlaylistDeletedFulfilledAction,
  PlaylistDeletedFailedAction,
} from './playlist-list.actions';

@Injectable()
export class PlaylistListEffects {
  constructor(
    protected http: Http,
    protected actions$: Actions,
    protected playlistList: PlaylistListService,
    protected playlistApi: PlaylistListApiService
  ) { }

  @Effect()
  load$ = this.actions$
    .ofType(PLAYLIST_LOADED)
    .switchMap(() => this.playlistApi.fetch()
      .map(playlists => new PlaylistLoadedFulfilledAction(playlists))
      .catch(error => Observable.of(new PlaylistLoadedFailedAction(error)))

    );

  @Effect()
  create$ = this.actions$
    .ofType(PLAYLIST_CREATED)
    .switchMap(({ payload }) => this.playlistApi.create(payload)
      .map(playlist => new PlaylistCreatedFulfilledAction(playlist))
      .catch(error => Observable.of(new PlaylistCreatedFailedAction(error)))
    );

  @Effect()
  update$ = this.actions$
    .ofType(PLAYLIST_UPDATED)
    .switchMap(({ payload }) => this.playlistApi.update(payload)
      .map(playlist => new PlaylistUpdatedFulfilledAction(playlist))
      .catch(error => Observable.of(new PlaylistUpdatedFailedAction(error)))
    );

  @Effect()
  delete$ = this.actions$
    .ofType(PLAYLIST_DELETED)
    .switchMap(({ payload }) => this.playlistApi.delete(payload)
      .map(playlist => new PlaylistDeletedFulfilledAction(playlist))
      .catch(error => Observable.of(new PlaylistDeletedFailedAction(error)))
    );
}
