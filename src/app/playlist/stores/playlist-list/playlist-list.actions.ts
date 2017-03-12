import { Action } from '@ngrx/store';
import { Playlist } from '../../interfaces';

// -------------------------------------------------------------------
// TYPE

export const PLAYLIST_CREATED = 'PLAYLIST_CREATED';
export const PLAYLIST_UPDATED = 'PLAYLIST_UPDATED';
export const PLAYLIST_DELETED = 'PLAYLIST_DELETED';

// -------------------------------------------------------------------
// BASE

export abstract class PlaylistActionBase implements Action {
  type: string;
  constructor(public payload: Playlist) { }
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
