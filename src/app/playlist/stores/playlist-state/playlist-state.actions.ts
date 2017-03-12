
import { Action } from '@ngrx/store';
import { PlaylistState } from '../../interfaces';


export const PLAYLIST_STATE_CHANGED = 'PLAYLIST_STATE_CHANGED';


export abstract class PlaylistStateActionBase implements Action {
  type: string;
  constructor(public payload: Partial<PlaylistState>) { }
}


export class PlaylistStateChangedAction extends PlaylistStateActionBase {
  type = PLAYLIST_STATE_CHANGED;
}
