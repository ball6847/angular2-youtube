import { Action } from '@ngrx/store';
import { Playlist } from '../../interfaces';

// @todo: find a way to seprate this
import { Video } from '../../../video';

export const PLAYLIST_ACTIVE_INIT = 'PLAYLIST_ACTIVE_INIT';
export const PLAYLIST_ACTIVE_INIT_FULFILLED = 'PLAYLIST_ACTIVE_INIT_FULFILLED';
export const PLAYLIST_ACTIVE_INIT_FAILED = 'PLAYLIST_ACTIVE_INIT_FAILED';
export const PLAYLIST_ACTIVATED = 'PLAYLIST_ACTIVATED';
export const PLAYLIST_ACTIVATED_FULFILLED = 'PLAYLIST_ACTIVATED_FULFILLED';
export const PLAYLIST_ACTIVE_ENTRIES_REORDERED = 'PLAYLIST_ACTIVE_ENTRIES_REORDERED';
export const PLAYLIST_ACTIVE_ENTRIES_DEACTIVATED = 'PLAYLIST_ACTIVE_ENTRIES_DEACTIVATED';
export const PLAYLIST_ACTIVE_ENTRY_ADDED = 'PLAYLIST_ACTIVE_ENTRY_ADDED';
export const PLAYLIST_ACTIVE_ENTRY_REMOVED = 'PLAYLIST_ACTIVE_ENTRY_REMOVED';
export const PLAYLIST_ACTIVE_ENTRY_ACTIVATED = 'PLAYLIST_ACTIVE_ENTRY_ACTIVATED';
export const PLAYLIST_ACTIVE_ENTRY_UPDATED = 'PLAYLIST_ACTIVE_ENTRY_UPDATED';


export abstract class PlaylistActiveActionBase implements Action {
  type: string;
  constructor(public payload: Partial<Playlist>) { }
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


export class PlaylistActiveInitAction implements Action {
  type = PLAYLIST_ACTIVE_INIT;
  payload: null;
}

export class PlaylistActiveInitFulfilledAction extends PlaylistActiveActionBase {
  type = PLAYLIST_ACTIVE_INIT_FULFILLED;
}
export class PlaylistActiveInitFailedAction extends PlaylistActiveInitAction {
  type = PLAYLIST_ACTIVE_INIT_FAILED;
}

export class PlaylistActivatedAction extends PlaylistActiveActionBase {
  type = PLAYLIST_ACTIVATED;
}

export class PlaylistActivatedFulfilledAction extends PlaylistActiveActionBase {
  type = PLAYLIST_ACTIVATED_FULFILLED;
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

