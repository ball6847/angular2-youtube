import { Action } from '@ngrx/store';
import { Video } from '../../../video'; // @todo: find a way to seprate this


// -------------------------------------------------------------------
// ActionTypes

export const ActionTypes = {
  LOAD: '[playlistEntries] Load',
  LOAD_ERROR: '[playlistEntries] Load > Error',
  LOAD_SUCCESS: '[playlistEntries] Load > Success',
  REORDER: '[playlistEntries] Reorder',
  REORDER_ERROR: '[playlistEntries] Reorder > Error',
  REORDER_SUCCESS: '[playlistEntries] Reorder > Success',
  CREATE: '[playlistEntries] Create',
  CREATE_ERROR: '[playlistEntries] Create > Error',
  CREATE_SUCCESS: '[playlistEntries] Create > Success',
  DELETE: '[playlistEntries] Delete',
  DELETE_ERROR: '[playlistEntries] Delete > Error',
  DELETE_SUCCESS: '[playlistEntries] Delete > Success',
  UPDATE: '[playlistEntries] Update',
  UPDATE_ERROR: '[playlistEntries] Update > Error',
  UPDATE_SUCCESS: '[playlistEntries] Update > Success',
}


// -------------------------------------------------------------------
// Actions

export class LoadPlaylistEntriesAction implements Action {
  type = ActionTypes.LOAD;
  constructor(public payload = null) { }
}

export class LoadPlaylistEntriesSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: Video[]) { }
}

export class LoadPlaylistEntriesErrorAction implements Action {
  type = ActionTypes.LOAD_ERROR
  constructor(public payload: any) {}
}

export class ReorderPlaylistEntriesAction implements Action {
  type = ActionTypes.REORDER;
  constructor(public payload: Video[]) { }
}

export class ReorderPlaylistEntriesSuccessAction implements Action {
  type = ActionTypes.REORDER_SUCCESS;
  constructor(public payload: any) { }
}

export class ReorderPlaylistEntriesErrorAction implements Action {
  type = ActionTypes.REORDER_ERROR
  constructor(public payload: any) { }
}

export class CreatePlaylistEntryAction implements Action {
  type = ActionTypes.CREATE;
  constructor(public payload: Video) { }
}

export class CreatePlaylistEntrySuccessAction implements Action {
  type = ActionTypes.CREATE_SUCCESS;
  constructor(public payload: any) { }
}

export class CreatePlaylistEntryErrorAction implements Action {
  type = ActionTypes.CREATE_ERROR
  constructor(public payload: any) { }
}

export class DeletePlaylistEntryAction implements Action {
  type = ActionTypes.DELETE;
  constructor(public payload: Video) { }
}

export class DeletePlaylistEntrySuccessAction implements Action {
  type = ActionTypes.DELETE_SUCCESS;
  constructor(public payload: any) { }
}

export class DeletePlaylistEntryErrorAction implements Action {
  type = ActionTypes.DELETE_ERROR
  constructor(public payload: any) { }
}

export class UpdatePlaylistEntryAction implements Action {
  type = ActionTypes.UPDATE;
  constructor(public payload: Video) { }
}

export class UpdatePlaylistEntrySuccessAction implements Action {
  type = ActionTypes.UPDATE_SUCCESS;
  constructor(public payload: any) { }
}

export class UpdatePlaylistEntryErrorAction implements Action {
  type = ActionTypes.UPDATE_ERROR
  constructor(public payload: any) { }
}


// -------------------------------------------------------------------
// Union Actions for Reducer

export type Actions
  = LoadPlaylistEntriesAction
  | LoadPlaylistEntriesErrorAction
  | LoadPlaylistEntriesSuccessAction
  | ReorderPlaylistEntriesAction
  | ReorderPlaylistEntriesErrorAction
  | ReorderPlaylistEntriesSuccessAction
  | CreatePlaylistEntryAction
  | CreatePlaylistEntryErrorAction
  | CreatePlaylistEntrySuccessAction
  | DeletePlaylistEntryAction
  | DeletePlaylistEntryErrorAction
  | DeletePlaylistEntrySuccessAction
  | UpdatePlaylistEntryAction
  | UpdatePlaylistEntryErrorAction
  | UpdatePlaylistEntrySuccessAction
