import { Action } from '@ngrx/store';
import { Playlist, PlaylistState } from './model';

export function PlaylistListReducer(state: Playlist[] = [], { type, payload }: Action): Playlist[] {
  switch (type) {
    case 'PLAYLIST_CREATED':
      return [...state, payload];

    case 'PLAYLIST_UPDATED':
      return state.map(playlist => playlist.id === payload.id ? payload : playlist);

    case 'PLAYLIST_DELETED':
      return state.filter(playlist => playlist.id !== payload.id);

    default:
      return state;
  }
}

export function PlaylistActiveReducer(state: Playlist, { type, payload }: Action): Playlist {
  switch (type) {
    case 'PLAYLIST_ACTIVE_CHANGED':
      return Object.assign({}, payload);

    default:
      return state;
  }
}

const defaultState: PlaylistState = {
  playing: false,
  loop: false,
  shuffle: false
};

export function PlaylistControlStateReducer(state: PlaylistState = defaultState, { type, payload }: Action): PlaylistState {
  switch (type) {
    case 'PLAYLIST_CONTROL_STATE_CHANGED':
      return payload;

    default:
      return state;
  }
}
