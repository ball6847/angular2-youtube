import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { IApplicationState } from 'app/shared/interfaces'
import { Playlist } from '../../interfaces';
import {  } from '../playlist-list/';
import * as action from './active-playlist.actions';
import { ActivePlaylistApiService } from './active-playlist.api';

// @todo: find a way to separate this
import { Video } from '../../../video';


@Injectable()
export class ActivePlaylistService {
  constructor(protected store: Store<IApplicationState>, public activePlaylistApi: ActivePlaylistApiService) {
  }




  /**
   * Get list playlist as Observable
   *
   * @returns Observable<Playlist>
   */
  get(): Observable<Playlist> {
    return this.store.select(state => state.playlistActive);
  }

  init() {
    this.store.dispatch(
      new action.PlaylistActiveInitAction()
    );
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

  listEntries() {
    this.store.dispatch(
      new action.PlaylistActiveListEntriesAction()
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

    // @todo: will move to effect
    this.activePlaylistApi.addEntry(video);
  }

  /**
   * Update video in the active playlist, generally update video duration
   *
   * @param video
   */
  updateEntry(video: Video) {
    this.store.dispatch(
      new action.PlaylistActiveEntryUpdatedAction(video)
    );

    // @todo: will move to effect
    // this.activePlaylistApi.updateEntry(video);
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

    // @todo: will move to effect
    this.activePlaylistApi.dropEntry(video);
  }
}
