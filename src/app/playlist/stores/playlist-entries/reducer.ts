import { Video } from 'app/video'
import { tassign } from 'tassign';
import { Actions, ActionTypes } from './actions';


export function PlaylistEntriesReducer(state: Video[] = [], {type, payload}: Actions): Video[] {
  switch (type) {
    // replace local state using data from server
    // this is the only action which accepted the data from server
    case ActionTypes.LOAD_SUCCESS:
      return <Video[]>payload;

    // replace the whole state with new ordering
    case ActionTypes.REORDER:
      return <Video[]>payload;

    // append newly created object to state
    case ActionTypes.CREATE:
      return [...state, <Video>payload];

    case ActionTypes.CREATE_SUCCESS:
      return state.map((entry: Video) => (entry.uuid == payload.uuid) ? payload : entry);

    // filter payload out of state
    case ActionTypes.DELETE:
      return state.filter((entry: Video) => entry.uuid != payload.uuid);

    // replace payload to object with the same $key, otherwise keep it untouched
    case ActionTypes.UPDATE:
      return state.map((entry: Video) => (entry.$key == (<Video>payload).$key) ? <Video>payload : entry);

    default:
      return state;
  }
}
