import { Video } from 'app/video'
import { tassign } from 'tassign';


import {
  PLAYLIST_ENTRIES_INIT,
  PLAYLIST_ENTRIES_INIT_FAILED,
  PLAYLIST_ENTRIES_INIT_FULFILLED,
  PlaylistEntriesActionBase,
  PlaylistEntriesInitAction,
  PlaylistEntriesInitFailedAction,
  PlaylistEntriesInitFulfilledAction
} from './playlist-entries.actions'


export function PlaylistEntriesReducer(state = [], action: PlaylistEntriesActionBase): Video[] {
  switch (action.type) {
    case PLAYLIST_ENTRIES_INIT:
      return state;
    case PLAYLIST_ENTRIES_INIT_FULFILLED:
      return <Video[]>action.payload;

    default:
      return state;
  }
}
