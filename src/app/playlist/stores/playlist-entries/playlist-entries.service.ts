import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store';
import {
  PlaylistEntriesInitAction
} from './playlist-entries.actions';

@Injectable()
export class PlaylistEntriesService {
  constructor(protected store: Store<any>) {

  }

  init() {
    this.store.dispatch(new PlaylistEntriesInitAction(null));
  }
}
