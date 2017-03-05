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

export function PlaylistControlStateReducer(state = new PlaylistState(), { type, payload }: Action): PlaylistState {
  switch (type) {
    case 'PLAYLIST_CONTROL_STATE_CHANGED':
      return payload;
    
    case 'PLAYLIST_CONTROL_STATE_VIDEO_CHANGED':
      return Object.assign({}, state, { video: payload });

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