import { Action } from '@ngrx/store';

// @todo: find a way to seprate this
import { Video } from '../../../video';


export const PLAYLIST_ENTRIES_INIT = 'PLAYLIST_ENTRIES_INIT';
export const PLAYLIST_ENTRIES_INIT_FULFILLED = 'PLAYLIST_ENTRIES_INIT_FULFILLED';
export const PLAYLIST_ENTRIES_INIT_FAILED = 'PLAYLIST_ENTRIES_INIT_FAILED';


export abstract class PlaylistEntriesActionBase implements Action {
  type: string;
  constructor(public payload: Video | Video[]) { }
}

export class PlaylistEntriesInitAction extends PlaylistEntriesActionBase {
  type = PLAYLIST_ENTRIES_INIT
}
export class PlaylistEntriesInitFulfilledAction extends PlaylistEntriesActionBase {
  type = PLAYLIST_ENTRIES_INIT
}
export class PlaylistEntriesInitFailedAction extends PlaylistEntriesActionBase {
  type = PLAYLIST_ENTRIES_INIT
}
