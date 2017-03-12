import { Action } from '@ngrx/store';
import { Playlist } from '../../interfaces';

// -------------------------------------------------------------------
// TYPE

export const PLAYLIST_LOADED = 'PLAYLIST_LOADED';
export const PLAYLIST_LOADED_FULFILLED = 'PLAYLIST_LOADED_FULFILLED';
export const PLAYLIST_LOADED_FAILED = 'PLAYLIST_LOADED_FAILED';
export const PLAYLIST_CREATED = 'PLAYLIST_CREATED';
export const PLAYLIST_CREATED_FULFILLED = 'PLAYLIST_CREATED_FULFILLED';
export const PLAYLIST_CREATED_FAILED = 'PLAYLIST_CREATED_FAILED';
export const PLAYLIST_UPDATED = 'PLAYLIST_UPDATED';
export const PLAYLIST_UPDATED_FULFILLED = 'PLAYLIST_UPDATED_FULFILLED';
export const PLAYLIST_UPDATED_FAILED = 'PLAYLIST_UPDATED_FAILED';
export const PLAYLIST_DELETED = 'PLAYLIST_DELETED';
export const PLAYLIST_DELETED_FULFILLED = 'PLAYLIST_DELETED_FULFILLED';
export const PLAYLIST_DELETED_FAILED = 'PLAYLIST_DELETED_FAILED';

// -------------------------------------------------------------------
// BASE

export abstract class PlaylistActionBase implements Action {
  type: string;
  constructor(public payload: Playlist) { }
}

export abstract class PlaylistItemsActionBase implements Action {
  type: string;
  constructor(public payload: Playlist[]) { }
}

// -------------------------------------------------------------------
// ACTION

export class PlaylistLoadedAction implements Action {
  type = PLAYLIST_LOADED;
  constructor(public payload?: any) { }
}

export class PlaylistLoadedFulfilledAction extends PlaylistItemsActionBase {
  type = PLAYLIST_LOADED_FULFILLED;
}

export class PlaylistLoadedFailedAction implements Action {
  type = PLAYLIST_LOADED_FAILED;
  constructor(public payload?: any) {}
}

export class PlaylistCreatedAction extends PlaylistActionBase {
  type = PLAYLIST_CREATED;
}

export class PlaylistCreatedFulfilledAction extends PlaylistActionBase {
  type = PLAYLIST_CREATED_FULFILLED;
}

export class PlaylistCreatedFailedAction implements Action {
  type = PLAYLIST_CREATED_FAILED;
  constructor(public payload?: any) { }
}

export class PlaylistUpdatedAction extends PlaylistActionBase {
  type = PLAYLIST_UPDATED;
}

export class PlaylistUpdatedFulfilledAction extends PlaylistActionBase {
  type = PLAYLIST_UPDATED_FULFILLED;
}

export class PlaylistUpdatedFailedAction implements Action {
  type = PLAYLIST_UPDATED_FAILED;
  constructor(public payload?: any) { }
}

export class PlaylistDeletedAction extends PlaylistActionBase {
  type = PLAYLIST_DELETED;
}

export class PlaylistDeletedFulfilledAction extends PlaylistActionBase {
  type = PLAYLIST_DELETED_FULFILLED;
}

export class PlaylistDeletedFailedAction implements Action {
  type = PLAYLIST_DELETED_FAILED;
  constructor(public payload?: any) { }
}
