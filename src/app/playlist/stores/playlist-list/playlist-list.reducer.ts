import * as ACTION from './playlist-list.actions';
import { Playlist } from '../../interfaces'

// -------------------------------------------------------------------
// REDUCER

export function PlaylistListReducer(state: Playlist[] = [], action: ACTION.PlaylistActionBase): Playlist[] {
  switch (action.type) {
    case ACTION.PLAYLIST_CREATED:
      return [...state, action.payload];
    case ACTION.PLAYLIST_UPDATED:
      return state.map(playlist => playlist.id === action.payload.id ? action.payload : playlist);
    case ACTION.PLAYLIST_DELETED:
      return state.filter(playlist => playlist.id !== action.payload.id);
    default:
      return state;
  }
}

