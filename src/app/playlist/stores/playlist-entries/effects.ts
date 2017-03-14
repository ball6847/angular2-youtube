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

  private videos:any = [];

  private startTime;

  private _start() {
    this.startTime = (new Date()).getTime();
  }

  private _stop() {
    const elapsed = (new Date()).getTime() - this.startTime;
    this.startTime = null;
    return elapsed/1000+"s";
  }

  /**
   * @todo store only video id in /entries/{playlist.id}
   *       and join them after list() to maintain sortability of playlist
   */
  @Effect()
  load$ = this.actions
    .ofType(ActionTypes.LOAD)
    .switchMap(action => this.playlist.get().take(1))
    .switchMap((playlist: Playlist) => this.af.database.list(this._ref(playlist)).take(1))
    .do(() => this._start())
    .switchMap(entries => {
      // list empty, just return observable of empty array
      // please note, if we skip this and pass empty array to forkJoin it won't be executed
      if (!entries.length) {
        return Observable.of([]);
      }

      // this is very tricky, pull video detail from cache or firebase
      return Observable.forkJoin(
        // turn entries in to array of Observable
        entries.map(entry => {
          // do not fetch from firebase if it already on local cache
          if (this.videos[entry.uuid])
            return Observable.of(this.videos[entry.uuid]);

          // no, it's not. We will fetch those not cached from firebase
          // and cache it locally
          return this.af.database
            .object(`/dev/videos/${entry.videoId}`)
            .take(1)
            .map(video => Object.assign({}, video, entry))
            .do(video => {
              this.videos[video.uuid] = video;
            })
        })
      )
    })
    .do((entries) => {
      // console.log(this.videos);
      console.log('elapsed time', this._stop())
    })
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
    .switchMap(({ payload }) => this.playlist.get().take(1)
      .map(playlist => {
        console.log('gonna push to:', playlist.id);
        return this.af.database
          .list(this._ref(playlist))
          .push({ uuid: payload.uuid, videoId: payload.videoId })
      })
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
    .switchMap(({ type, payload }) => this.playlist.get().take(1)
      .take(1)
      .map((playlist: Playlist) => {
        const collection = this.af.database.list(this._ref(playlist), {
          query: {
            orderByChild: 'uuid',
            equalTo: payload.uuid
          }
        });

        collection
          .take(1)
          .subscribe(entries => entries.forEach(entry => collection.remove(entry.$key)));

        return collection;
      })
      .map(result => new DeletePlaylistEntrySuccessAction(result))
      .catch(error => Observable.of(new DeletePlaylistEntryErrorAction(error)))
    );

  @Effect()
  update$ = this.actions
    .ofType(ActionTypes.UPDATE)
    .switchMap(({ type, payload }) => this.playlist.get().take(1)
      .map((playlist: Playlist) => this.af.database
        .object(this._ref(playlist, <Video>payload))
        .update(<Video>payload)) // need both playlist and entry
      .map(result => new UpdatePlaylistEntrySuccessAction(result))
      .catch(error => Observable.of(new UpdatePlaylistEntryErrorAction(error)))
    )


}
