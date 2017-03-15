import { tassign } from 'tassign';
import { PlaylistState } from '../../interfaces';
import { Actions, ActionTypes } from './actions';


export function PlaylistStateReducer(state = new PlaylistState(), { type, payload }: Actions): PlaylistState {
  switch (type) {
    // recieve state update from server
    case ActionTypes.LOAD_SUCCESS:
      return tassign(state, payload);

    // update local state immediately
    case ActionTypes.UPDATE:
      return tassign(state, payload);

    default:
      return state;
  }
}
