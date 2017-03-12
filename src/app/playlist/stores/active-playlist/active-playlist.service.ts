import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { IApplicationState } from 'app/shared/interfaces'
import { Playlist } from '../../interfaces';
import {  } from '../playlist-list/';
import * as action from './active-playlist.actions';

// @todo: find a way to separate this
import { Video } from '../../../video';


@Injectable()
export class ActivePlaylistService {
  constructor(protected store: Store<IApplicationState>) {}

  /**
   * Get list playlist as Observable
   *
   * @returns Observable<Playlist>
   */
  get(): Observable<Playlist> {
    return this.store.select(state => state.playlistActive);
  }


  /**
   * Activate playlist
   *
   * @param playlist
   */
  activate(playlist: Playlist) {
    this.store.dispatch(
      new action.PlaylistActivatedAction(playlist)
    );
  }


  /**
   * Deactivate playlist
   *
   */
  deactivate() {
    this.store.dispatch(
      new action.PlaylistActiveEntriesDeactivatedAction()
    );
  }

  /**
   * Set new ordering
   *
   * @param entries
   */
  saveOrdering(entries: Video[]) {
    this.store.dispatch(
      new action.PlaylistActiveEntriesReorderedAction(entries)
    );
  }

  /**
   * Add new video to active playlist
   *
   * @param video
   */
  enqueue(video: Video) {
    this.store.dispatch(
      new action.PlaylistActiveEntryAddedAction(video)
    );
  }

  /**
   * Update video in the active playlist5
   *
   * @param video
   */
  updateEntry(video: Video) {
    this.store.dispatch(
      new action.PlaylistActiveEntryUpdatedAction(video)
    );
  }


  /**
   * Remove video from playlist
   *
   * @param video
   */
  dequeue(video: Video) {
    this.store.dispatch(
      new action.PlaylistActiveEntryRemovedAction(video)
    );
  }
}
