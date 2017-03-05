import { Action } from '@ngrx/store';
import { Playlist, PlaylistState } from './model';
import { Video } from '../../video';

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
      return payload;
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

export function PlaylistEntriesReducer(state: Video[] = [], { type, payload }: Action): Video[] {
  switch (type) {
    case 'PLAYLIST_ENTRIES_LOADED':
      return payload;

    case 'PLAYLIST_ENTRIES_CHILD_ADDED':
      return [...state, payload];

    case 'PLAYLIST_ENTRIES_CHILD_REMOVED':
      return state.filter(video => video.uuid !== payload.uuid);

    case 'PLAYLIST_ENTRIES_CHILD_ACTIVATED':
      return state
        .map(video => {
          // this video is playing, others not
          return Object.assign({}, video, { playing: (video.uuid === payload.uuid) });
        });

    default:
      return state;
  }
}



// @TODO scope in domain
export interface PlaylistAppState {
  list: Playlist[],
  active: Playlist,
  state: PlaylistState,
  entries: Video[]
}


const PlaylistReducer = {
  list: PlaylistListReducer,
  active: PlaylistActiveReducer,
  state: PlaylistControlStateReducer,
  entries: PlaylistEntriesReducer
};
