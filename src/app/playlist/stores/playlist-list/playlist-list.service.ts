import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { UUID } from 'angular2-uuid';
import { tassign } from 'tassign';
import { Playlist } from '../../interfaces';
import { ActivePlaylistService } from '../active-playlist';
import * as action from './playlist-list.actions';

// @todo: find a way to separate this
import { IApplicationState } from 'app/shared/interfaces'

@Injectable()
export class PlaylistListService {
  constructor( private store: Store<IApplicationState>, protected activePlaylist: ActivePlaylistService) {

  }

  initialize() {
    this.store.dispatch(new action.PlaylistLoadedAction());
  }

  /**
   *
   *
   */
  get(): Observable<Playlist[]> {
    return this.store.select(state => state.playlistList);
  }

  /**
   * Create a new playlist and giving it a name
   *
   * @param name
   */
  create(name: string) {
    const playlist: Playlist = {
      id: UUID.UUID(),
      name: name,
      entries: []
    };

    this.store.dispatch(new action.PlaylistCreatedAction(playlist));
    this.activePlaylist.activate(playlist);
  }

  /**
   *
   *
   * @param playlist
   */
  update(playlist: Playlist) {
    this.store.dispatch(new action.PlaylistUpdatedAction(playlist));
  }

  /**
   * Rename a given playlist to another name
   *
   * @param playlist
   * @param name
   */
  rename(playlist: Playlist, name: string) {
    const p = tassign(playlist, { name: name });

    this.update(p);

    this.activePlaylist.activate(p);
  }

  /**
   * Remove a given playlist from store
   *
   * @param playlist
   */
  delete(playlist: Playlist): void {
    this.store.dispatch(new action.PlaylistDeletedAction(playlist));
    this.activePlaylist.activate(null);
  }
}
