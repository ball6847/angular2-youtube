import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { PlaylistState } from '../../interfaces';
import { LoadPlaylistStateAction, UpdatePlaylistStateAction } from './actions';

import { IApplicationState } from '../../../shared/interfaces'

@Injectable()
export class PlaylistStateService {
  constructor(protected store: Store<IApplicationState>) { }

  getStore(): Observable<PlaylistState> {
    return this.store.select(state => state.playlistState);
  }

  initialize() {
    this.store.dispatch(new LoadPlaylistStateAction());
  }

  setState(state: Partial<PlaylistState>) {
    this.store.dispatch(new UpdatePlaylistStateAction(state));
  }
}
