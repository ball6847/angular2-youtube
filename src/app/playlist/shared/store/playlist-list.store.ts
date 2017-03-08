import { Action } from '@ngrx/store';
import { Playlist } from '../interface';

// -------------------------------------------------------------------
// TYPE

const PLAYLIST_CREATED = 'PLAYLIST_CREATED';
const PLAYLIST_UPDATED = 'PLAYLIST_UPDATED';
const PLAYLIST_DELETED = 'PLAYLIST_DELETED';

// -------------------------------------------------------------------
// BASE

abstract class PlaylistActionBase implements Action {
  type: string;
  constructor(public payload: Playlist) {}
}

// -------------------------------------------------------------------
// ACTION

export class PlaylistCreatedAction extends PlaylistActionBase {
  type = PLAYLIST_CREATED;
}

export class PlaylistUpdatedAction extends PlaylistActionBase {
  type = PLAYLIST_UPDATED;
}

export class PlaylistDeletedAction extends PlaylistActionBase {
  type = PLAYLIST_DELETED;
}

// -------------------------------------------------------------------
// REDUCER

export function PlaylistListReducer(state: Playlist[] = [], action: PlaylistActionBase): Playlist[] {
  switch (action.type) {
    case PLAYLIST_CREATED:
      return [...state, action.payload];
    case PLAYLIST_UPDATED:
      return state.map(playlist => playlist.id === action.payload.id ? action.payload : playlist);
    case PLAYLIST_DELETED:
      return state.filter(playlist => playlist.id !== action.payload.id);
    default:
      return state;
  }
}
