import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/forkJoin';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { ActivePlaylistService } from '../active-playlist';
import {
  ActionTypes,
  LoadPlaylistEntriesSuccessAction,
  LoadPlaylistEntriesErrorAction,
  ReorderPlaylistEntriesSuccessAction,
  ReorderPlaylistEntriesErrorAction,
  CreatePlaylistEntrySuccessAction,
  CreatePlaylistEntryErrorAction,
  DeletePlaylistEntrySuccessAction,
  DeletePlaylistEntryErrorAction,
  UpdatePlaylistEntrySuccessAction,
  UpdatePlaylistEntryErrorAction
} from './actions';

import { Playlist } from '../../interfaces';
import { Video } from 'app/video';


@Injectable()
export class PlaylistEntriesEffects {
  constructor(
    protected actions: Actions,
    protected af: AngularFire,
    protected playlist: ActivePlaylistService
  ) {}

  private _ref(playlist: Playlist, video?: Video): string {
    let ref = `/dev/entries/${playlist.id}`;

    if (video)
      ref += `/${video.$key}`;

    return ref;
  }

  /**
   * @todo store only video id in /entries/{playlist.id}
   *       and join them after list() to maintain sortability of playlist
   */
  @Effect()
  load$ = this.actions
    .ofType(ActionTypes.LOAD)
    .switchMap(action => this.playlist.get())
    .switchMap((playlist: Playlist) => this.af.database.list(this._ref(playlist)))
    .switchMap(entries => {
      return entries.length ? Observable.forkJoin(entries.map(entry => this.af.database.object(`/dev/videos/${entry.videoId}`).take(1).map(video => Object.assign({}, video, entry)))) : Observable.of([]);
    })
    // .do(entries => {

    //   Observable.forkJoin(entries.map(entry => this.af.database.object(`/dev/videos/${entry.videoId}`).take(1).map(video => Object.assign({}, video, entry))))


    // })
    .map((entries) => new LoadPlaylistEntriesSuccessAction(entries))
    .catch(error => Observable.of(new LoadPlaylistEntriesErrorAction(error)))

  // @Effect()
  // reorder$ = this.actions
  //   .ofType(ActionTypes.REORDER)
  //   .switchMap(({ type, payload }) => this.playlist.get()
  //     .map((playlist: Playlist) => this.af.database
  //       .list(this._ref(playlist))
  //   ));

  @Effect()
  create$ = this.actions
    .ofType(ActionTypes.CREATE)
    .switchMap(({ payload }) => this.playlist.get()
      .map(playlist => this.af.database
        .list(this._ref(playlist))
        .push({ uuid: payload.uuid, videoId: payload.videoId })
      )
      .map(() => this.af.database
        .object(`/dev/videos/${payload.videoId}`)
        // remove uuid from video since all playlist will share the same video pool
        .update(Object.assign({}, payload, { uuid: null }))
      )
    )
    .map(result => new CreatePlaylistEntrySuccessAction(result))
    // .switchMap(({ type, payload }) => this.playlist.get()
    //   .map((playlist: Playlist) => this.af.database
    //     .list(this._ref(playlist))
    //     .push(<Video>payload)) // need both playlist and entry
    //   .map(result => new CreatePlaylistEntrySuccessAction(result))
    //   .catch(error => Observable.of(new CreatePlaylistEntryErrorAction(error)))
    // );

  @Effect()
  delete$ = this.actions
    .ofType(ActionTypes.DELETE)
    .switchMap(({ type, payload }) => this.playlist.get()
      .map((playlist: Playlist) => {
        const collection = this.af.database.list(this._ref(playlist), {
          query: {
            orderByChild: 'uuid',
            equalTo: payload.uuid
          }
        });
        collection.subscribe(entries => {
          collection.remove(entries[0].$key);
        });
        return collection;
      })
      .map(result => new DeletePlaylistEntrySuccessAction(result))
      .catch(error => Observable.of(new DeletePlaylistEntryErrorAction(error)))
    );

  @Effect()
  update$ = this.actions
    .ofType(ActionTypes.UPDATE)
    .switchMap(({ type, payload }) => this.playlist.get()
      .map((playlist: Playlist) => this.af.database
        .object(this._ref(playlist, <Video>payload))
        .update(<Video>payload)) // need both playlist and entry
      .map(result => new UpdatePlaylistEntrySuccessAction(result))
      .catch(error => Observable.of(new UpdatePlaylistEntryErrorAction(error)))
    )


}
