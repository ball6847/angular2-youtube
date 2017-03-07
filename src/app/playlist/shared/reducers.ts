import { Action } from '@ngrx/store';
import { tassign } from 'tassign';
import { Playlist, PlaylistState } from './interfaces';
import { Video } from '../../video';

// --------------------------------------------------------
// TYPE

export const PLAYLIST_ENTRIES_REORDER = 'PLAYLIST_ENTRIES_REORDER';
export const PLAYLIST_STATE_CHANGE = 'PLAYLIST_STATE_CHANGE';
export const PLAYLIST_STATE_VIDEO_CHANGE = 'PLAYLIST_STATE_VIDEO_CHANGE';

// --------------------------------------------------------
// ACTION

export class PlaylistEntriesReorderAction implements Action {
    type: string = PLAYLIST_ENTRIES_REORDER;
    constructor(public payload: Video[]) {}
}

export abstract class PlaylistStateBaseAction implements Action {
  type: string;
  constructor(public payload: Partial<PlaylistState>) {}
}

export class PlaylistStateChangeAction extends PlaylistStateBaseAction {
  type = PLAYLIST_STATE_CHANGE;
}

// --------------------------------------------------------
// REDUCER

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

export function PlaylistControlStateReducer(state = new PlaylistState(), { type, payload }: PlaylistStateBaseAction): PlaylistState {
  switch (type) {
    case PLAYLIST_STATE_CHANGE:
      return tassign(state, payload);
    default:
      return state;
  }
}

export function PlaylistEntriesReducer(state: Video[] = [], { type, payload }: Action): Video[] {
  switch (type) {
    case 'PLAYLIST_ENTRIES_LOADED':
      return payload;
    case PLAYLIST_ENTRIES_REORDER:
      return payload;
    case 'PLAYLIST_ENTRIES_CHILD_ADDED':
      return [...state, payload];
    case 'PLAYLIST_ENTRIES_CHILD_REMOVED':
      return state.filter(video => video.uuid !== payload.uuid);
    case 'PLAYLIST_ENTRIES_CHILD_ACTIVATED':
      return state.map(video => tassign(video, { playing: (video.uuid === payload.uuid) }));
    case 'PLAYLIST_ENTRIES_CLEAR_ACTIVATED':
      return state.map(video => tassign(video, { playing: false }));
    default:
      return state;
  }
}
