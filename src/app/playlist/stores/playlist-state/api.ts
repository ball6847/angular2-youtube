import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AngularFire, FirebaseAuthState } from 'angularfire2'
import { Observable } from 'rxjs/Observable';
import { PlaylistState } from '../../interfaces';
import { IApplicationState } from 'app/shared/interfaces';

@Injectable()
export class PlaylistStateApiService {

  currentState: PlaylistState;

  constructor(protected af: AngularFire, protected store: Store<IApplicationState>) {
    this.store.select(state => state.playlistState)
      .subscribe(state => this.currentState = state);
   }

  private skipNextLoad = false;

//   private _getCurrentState() {
//     return 
//  }

  /**
   * Shorthand for getting auth state
   */
  private _getAuth(): Observable<FirebaseAuthState> {
    return this.af.auth.take(1).filter(auth => !!auth);
  }

  /**
   * Load state from server
   *
   */
  load() : Observable<PlaylistState> {
    return this._getAuth()
      .switchMap(auth => this.af.database
        .object(`/dev/${auth.uid}/state/`)
        .filter((newState) => {
          console.log('newState', newState);
          console.log('currentState', this.currentState);
          return true;
          // const reject = !this.skipNextLoad;
          // this.skipNextLoad = false;
          // return reject;
        }));
  }

  /**
   * Update playlistState to firebase server
   *
   * @param playlistState
   */
  update(playlistState: Partial<PlaylistState>): Observable<Partial<PlaylistState>> {
    return this._getAuth()
      .do(() => this.skipNextLoad = true)  
      .do(auth => this.af.database.object(`/dev/${auth.uid}/state/`).update(playlistState))
      .map(() => playlistState);
  }
}
