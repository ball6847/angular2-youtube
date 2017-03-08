import { Action } from '@ngrx/store';
import { tassign } from 'tassign';
import { Video } from '../../../video';
import { Playlist } from '../interface';

// -------------------------------------------------------------------
// TYPE

const PLAYLIST_ACTIVATED = 'PLAYLIST_ACTIVATED';
const PLAYLIST_ACTIVE_ENTRIES_REORDERED = 'PLAYLIST_ACTIVE_ENTRIES_REORDERED';
const PLAYLIST_ACTIVE_ENTRIES_DEACTIVATED = 'PLAYLIST_ACTIVE_ENTRIES_DEACTIVATED';
const PLAYLIST_ACTIVE_ENTRY_ADDED = 'PLAYLIST_ACTIVE_ENTRY_ADDED';
const PLAYLIST_ACTIVE_ENTRY_REMOVED = 'PLAYLIST_ACTIVE_ENTRY_REMOVED';
const PLAYLIST_ACTIVE_ENTRY_ACTIVATED = 'PLAYLIST_ACTIVE_ENTRY_ACTIVATED';
const PLAYLIST_ACTIVE_ENTRY_UPDATED = 'PLAYLIST_ACTIVE_ENTRY_UPDATED';

// -------------------------------------------------------------------
// BASE

export abstract class PlaylistActiveActionBase implements Action {
  type: string;
  constructor(public payload: Partial<Playlist>) {}
}

export abstract class PlaylistActiveEntriesActionBase extends PlaylistActiveActionBase {
  constructor(videos: Video[]) {
    super({ entries: videos });
  }
}

export abstract class PlaylistActiveEntryActionBase extends PlaylistActiveEntriesActionBase {
  constructor(video: Video) {
    super([video]);
  }
}


// -------------------------------------------------------------------
// ACTION

export class PlaylistActivatedAction extends PlaylistActiveActionBase {
  type = PLAYLIST_ACTIVATED;
}

export class PlaylistActiveEntriesReorderedAction extends PlaylistActiveEntriesActionBase {
  type = PLAYLIST_ACTIVE_ENTRIES_REORDERED;
}

export class PlaylistActiveEntryAddedAction extends PlaylistActiveEntryActionBase {
  type = PLAYLIST_ACTIVE_ENTRY_ADDED;
}

export class PlaylistActiveEntryUpdatedAction extends PlaylistActiveEntryActionBase {
  type = PLAYLIST_ACTIVE_ENTRY_UPDATED;
}

export class PlaylistActiveEntryRemovedAction extends PlaylistActiveEntryActionBase {
  type = PLAYLIST_ACTIVE_ENTRY_REMOVED;
}

export class PlaylistActiveEntryActivatedAction extends PlaylistActiveEntryActionBase {
  type = PLAYLIST_ACTIVE_ENTRY_ACTIVATED;
}

export class PlaylistActiveEntriesDeactivatedAction extends PlaylistActiveEntryActionBase {
  type = PLAYLIST_ACTIVE_ENTRIES_DEACTIVATED;
  constructor() {
    super(null);
  }
}


// --------------------------------------------------------
// REDUCER

const defaultPlaylist: Playlist = {
  id: null,
  name: null,
  entries: []
};

export function PlaylistActiveReducer(state = defaultPlaylist, action: PlaylistActiveActionBase): Playlist {
  switch (action.type) {
    case PLAYLIST_ACTIVATED:
      return tassign(state, action.payload);

    case PLAYLIST_ACTIVE_ENTRIES_REORDERED:
      return tassign(state, { entries: action.payload.entries });

    case PLAYLIST_ACTIVE_ENTRIES_DEACTIVATED:
      if (!state) {
        return state;
      }
      return tassign(state, {
        entries: state.entries
          .map(video => tassign(video, { playing: false }))
      });

    case PLAYLIST_ACTIVE_ENTRY_ADDED:
      return tassign(state, {
        entries: [...state.entries, action.payload.entries[0]]
      });

    case PLAYLIST_ACTIVE_ENTRY_UPDATED:
      return tassign(state, {
        entries: state.entries
          .map(video => (video.uuid !== action.payload.entries[0].uuid) ? video : tassign(video, action.payload.entries[0]))
      });

    case PLAYLIST_ACTIVE_ENTRY_REMOVED:
      return tassign(state, {
        entries: state.entries
          .filter(video => video.uuid !== action.payload.entries[0].uuid)
      });

    case PLAYLIST_ACTIVE_ENTRY_ACTIVATED:
      return tassign(state, {
        entries: state.entries
          .map(video => tassign(video, {
            playing: (video.uuid === action.payload.entries[0].uuid)
          }))
      });

    default:
      return state;
  }
}

