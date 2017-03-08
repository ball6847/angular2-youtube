import { Action } from '@ngrx/store';
import { Playlist } from '../interface';

// -------------------------------------------------------------------
// TYPE

const PLAYLIST_ACTIVATED = 'PLAYLIST_ACTIVATED';

// -------------------------------------------------------------------
// BASE

abstract class PlaylistActiveActionBase implements Action {
  type: string;
  constructor(public payload: Playlist) {}
}

// -------------------------------------------------------------------
// ACTION

export class PlaylistActivatedAction extends PlaylistActiveActionBase {
  type = PLAYLIST_ACTIVATED;
}

// --------------------------------------------------------
// REDUCER

export function PlaylistActiveReducer(state: Playlist, action: PlaylistActiveActionBase): Playlist {
  switch (action.type) {
    case PLAYLIST_ACTIVATED:
      return action.payload;
    default:
      return state;
  }
}

