import 'rxjs/add/observable/of';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { PlaylistStateApiService } from './api';
import * as a from './actions';


@Injectable()
export class PlaylistStateEffects {
  constructor(protected actions: Actions, protected playlistStateApi: PlaylistStateApiService) { }

  @Effect()
  load$ = this.actions
    .ofType(a.ActionTypes.LOAD)
    .switchMap((action: a.LoadPlaylistStateAction) => this.playlistStateApi.load()
      .map(playlistState => new a.LoadPlaylistStateSuccessAction(playlistState))
      .catch(error => Observable.of(new a.LoadPlaylistStateErrorAction(error))));


  @Effect()
  update$ = this.actions
    .ofType(a.ActionTypes.UPDATE)
    .switchMap(({ payload }: a.UpdatePlaylistStateAction) => this.playlistStateApi.update(payload)
      .map(playlistState => new a.UpdatePlaylistStateSuccessAction(playlistState))
      .catch(error => Observable.of(new a.UpdatePlaylistStateErrorAction(error))));
}
