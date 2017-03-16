import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { Injectable } from '@angular/core';
import { AngularFire, FirebaseAuthState } from 'angularfire2'
import { Observable } from 'rxjs/Observable';
import { PlaylistState } from '../../interfaces';
import { PlaylistStateService } from './service';
import * as objectDiff from 'object-diff';
import * as _ from 'lodash';

@Injectable()
export class PlaylistStateApiService {

  state: PlaylistState;

  constructor(protected af: AngularFire, protected playlistState: PlaylistStateService) {
    // we keep track of state
    // to determine whether to accept or ignore state update from firebase
    this.playlistState.getStore()
      .subscribe(state => this.state = new PlaylistState(state));
   }

  /**
   * Shorthand for getting auth state
   */
  private _getAuth(): Observable<FirebaseAuthState> {
    return this.af.auth.take(1).filter(auth => !!auth);
  }

  /**
   * Load state from server
   *
   * firebase oftenly emit changes to all subscribers, circular trigger will be happend at some point
   * we need to handle theme explicitly and in this case, we control which changes we wanna take to the store or just ignore them
   *
   * @todo since we keep getting update from firebase, permission error will eventually occured when user signout from app
   *       we need to keep subscription instance to unsubscribe it later when user signout from app
   */
  load() : Observable<PlaylistState> {
    return this._getAuth()
      .switchMap(auth => this.af.database
        .object(`/dev/${auth.uid}/state/`)
        .filter((state: PlaylistState) => {
          const newState = new PlaylistState(state);
          // first, detect video changes
          // new entry uuid has come ?
          let videoDiff = {};
          if (this.state.video && newState.video) {
            videoDiff = objectDiff(this.state.video, newState.video);
            if (_.has(videoDiff, 'uuid'))
              return true;
          }
          // now detect state difference (playing, loop, shuffle)
          const diff = objectDiff(this.state, newState);
          delete diff.video;
          return !_.isEmpty(diff);
        }));
  }

  /**
   * Update playlistState to firebase server
   *
   * @param playlistState
   */
  update(playlistState: Partial<PlaylistState>): Observable<Partial<PlaylistState>> {
    return this._getAuth()
      .do(auth => this.af.database.object(`/dev/${auth.uid}/state/`).update(playlistState))
      .map(() => playlistState);
  }
}
