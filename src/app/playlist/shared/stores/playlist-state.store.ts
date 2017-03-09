import { Action } from '@ngrx/store';
import { tassign } from 'tassign';
import { PlaylistState } from '../interfaces';

// -------------------------------------------------------------------
// TYPE

const PLAYLIST_STATE_CHANGED = 'PLAYLIST_STATE_CHANGED';

// -------------------------------------------------------------------
// BASE

export abstract class PlaylistStateActionBase implements Action {
  type: string;
  constructor(public payload: Partial<PlaylistState>) {}
}

// -------------------------------------------------------------------
// ACTION

export class PlaylistStateChangedAction extends PlaylistStateActionBase {
  type = PLAYLIST_STATE_CHANGED;
}

// -------------------------------------------------------------------
// REDUCER

export function PlaylistControlStateReducer(state = new PlaylistState(), action: PlaylistStateActionBase): PlaylistState {
  switch (action.type) {
    case PLAYLIST_STATE_CHANGED:
      return tassign(state, action.payload);
    default:
      return state;
  }
}
