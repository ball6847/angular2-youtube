import { Action } from '@ngrx/store';
import { tassign } from 'tassign';
import { Video } from '../../../video';

// -------------------------------------------------------------------
// TYPE

const PLAYLIST_ENTRIES_LOADED = 'PLAYLIST_ENTRIES_LOADED';
const PLAYLIST_ENTRIES_REORDERED = 'PLAYLIST_ENTRIES_REORDERED';
const PLAYLIST_ENTRIES_CHILD_ADDED = 'PLAYLIST_ENTRIES_CHILD_ADDED';
const PLAYLIST_ENTRIES_CHILD_REMOVED = 'PLAYLIST_ENTRIES_CHILD_REMOVED';
const PLAYLIST_ENTRIES_CHILD_ACTIVATED = 'PLAYLIST_ENTRIES_CHILD_ACTIVATED';
const PLAYLIST_ENTRIES_CHILDREN_DEACTIVATED = 'PLAYLIST_ENTRIES_CHILDREN_DEACTIVATED';

// --------------------------------------------------------
// BASE

export abstract class PlaylistEntriesActionBase implements Action {
  type: string;
  constructor(public payload: Video[]) { }
}

export abstract class PlaylistEntriesItemActionBase extends PlaylistEntriesActionBase {
  constructor(payload: Video) {
    super([payload]);
  }
}

// --------------------------------------------------------
// ACTION

export class PlaylistEntriesLoadedAction extends PlaylistEntriesActionBase {
  type = PLAYLIST_ENTRIES_LOADED;
}

export class PlaylistEntriesReorderedAction extends PlaylistEntriesActionBase {
  type = PLAYLIST_ENTRIES_REORDERED;
}

export class PlaylistEntriesChildAddedAction extends PlaylistEntriesItemActionBase {
  type = PLAYLIST_ENTRIES_CHILD_ADDED;
}

export class PlaylistEntriesChildRemovedAction extends PlaylistEntriesItemActionBase {
  type = PLAYLIST_ENTRIES_CHILD_REMOVED;
}

export class PlaylistEntriesChildActivatedAction extends PlaylistEntriesItemActionBase {
  type = PLAYLIST_ENTRIES_CHILD_ACTIVATED;
}

export class PlaylistEntriesChildrenDeactivatedAction extends PlaylistEntriesItemActionBase {
  type = PLAYLIST_ENTRIES_CHILDREN_DEACTIVATED;
  constructor() {
    super(null);
  }
}

// -------------------------------------------------------------------
// REDUCER

export function PlaylistEntriesReducer(state: Video[] = [], action: PlaylistEntriesActionBase): Video[] {
  switch (action.type) {
    case PLAYLIST_ENTRIES_LOADED:
      return action.payload;
    case PLAYLIST_ENTRIES_REORDERED:
      return action.payload;
    case PLAYLIST_ENTRIES_CHILD_ADDED:
      return [...state, action.payload[0]];
    case PLAYLIST_ENTRIES_CHILD_REMOVED:
      return state.filter(video => video.uuid !== action.payload[0].uuid);
    case PLAYLIST_ENTRIES_CHILD_ACTIVATED:
      return state.map(video => tassign(video, { playing: (video.uuid === action.payload[0].uuid) }));
    case PLAYLIST_ENTRIES_CHILDREN_DEACTIVATED:
      return state.map(video => tassign(video, { playing: false }));
    default:
      return state;
  }
}
