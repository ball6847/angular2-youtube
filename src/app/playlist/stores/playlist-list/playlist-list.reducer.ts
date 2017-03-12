import { Playlist } from '../../interfaces'
import { PlaylistActionBase, PlaylistItemsActionBase } from './playlist-list.actions';
import {
  PLAYLIST_LOADED_FULFILLED,
  PLAYLIST_CREATED,
  PLAYLIST_UPDATED,
  PLAYLIST_DELETED
} from './playlist-list.actions';

// -------------------------------------------------------------------
// REDUCER

export function PlaylistListReducer(state: Playlist[] = [], action: PlaylistActionBase & PlaylistItemsActionBase): Playlist[] {
  switch (action.type) {
    case PLAYLIST_LOADED_FULFILLED:
      return action.payload;
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

