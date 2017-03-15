import { Action } from '@ngrx/store';
import { PlaylistState } from '../../interfaces';

// -------------------------------------------------------------------
// action types

export const ActionTypes = {
  LOAD: '[playlistState] Load',
  LOAD_ERROR: '[playlistState] Load > Error',
  LOAD_SUCCESS: '[playlistState] Load > Success',
  UPDATE: '[playlistState] Update',
  UPDATE_ERROR: '[playlistState] Update > Error',
  UPDATE_SUCCESS: '[playlistState] Update > Success',
}

// -------------------------------------------------------------------
// actions

export class LoadPlaylistStateAction implements Action {
  type = ActionTypes.LOAD;
  constructor(public payload = null) {}
}

export class LoadPlaylistStateSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: PlaylistState) {}
}

export class LoadPlaylistStateErrorAction implements Action {
  type = ActionTypes.LOAD_ERROR;
  constructor(public payload: PlaylistState) {}
}

export class UpdatePlaylistStateAction implements Action {
  type = ActionTypes.UPDATE;
  constructor(public payload: Partial<PlaylistState>) {}
}

export class UpdatePlaylistStateSuccessAction implements Action {
  type = ActionTypes.UPDATE_SUCCESS;
  constructor(public payload: Partial<PlaylistState>) {}
}

export class UpdatePlaylistStateErrorAction implements Action {
  type = ActionTypes.UPDATE_ERROR;
  constructor(public payload: PlaylistState) {}
}

// -------------------------------------------------------------------
// action alias for reducer

export type Actions
  = LoadPlaylistStateAction
  | LoadPlaylistStateErrorAction
  | LoadPlaylistStateErrorAction
  | UpdatePlaylistStateAction
  | UpdatePlaylistStateErrorAction
  | UpdatePlaylistStateErrorAction

