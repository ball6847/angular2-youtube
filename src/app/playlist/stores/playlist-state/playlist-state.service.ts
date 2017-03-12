import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { PlaylistState } from '../../interfaces';
import { PlaylistStateChangedAction } from './playlist-state.actions';

import { IApplicationState } from '../../../shared/interfaces'

@Injectable()
export class PlaylistStateService {
  constructor(protected store: Store<IApplicationState>) { }

  get(): Observable<PlaylistState> {
    return this.store.select(state => state.playlistState);
  }

  setState(state: Partial<PlaylistState>) {
    this.store.dispatch(
      new PlaylistStateChangedAction(state)
    );
  }
}
