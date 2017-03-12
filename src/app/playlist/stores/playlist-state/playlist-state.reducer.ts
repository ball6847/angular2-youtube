import { tassign } from 'tassign';
import { PlaylistState } from '../../interfaces';
import * as actions from './playlist-state.actions';


export function PlaylistControlStateReducer(state = new PlaylistState(), action: actions.PlaylistStateActionBase): PlaylistState {
  switch (action.type) {
    case actions.PLAYLIST_STATE_CHANGED:
      return tassign(state, action.payload);
    default:
      return state;
  }
}
