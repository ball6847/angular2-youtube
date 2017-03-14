import * as ACTION from './active-playlist.actions';
import { Playlist } from '../../interfaces'
import { tassign } from 'tassign';

const defaultPlaylist: Playlist = {
  id: null,
  name: null,
  entries: []
};

export function PlaylistActiveReducer(state = defaultPlaylist, action: ACTION.PlaylistActiveActionBase): Playlist {
  switch (action.type) {
    case ACTION.PLAYLIST_ACTIVE_INIT_FULFILLED:
      action.payload.entries = [];
      return <Playlist>action.payload;

    case ACTION.PLAYLIST_ACTIVATED:
      return tassign(state, action.payload);

    case ACTION.PLAYLIST_ACTIVE_ENTRIES_REORDERED:
      return tassign(state, { entries: action.payload.entries });

    // case ACTION.PLAYLIST_ACTIVE_ENTRIES_DEACTIVATED:
    //   if (!state) {
    //     return state;
    //   }
    //   return tassign(state, {
    //     entries: state.entries
    //       .map(video => tassign(video, { playing: false }))
    //   });

    case ACTION.PLAYLIST_ACTIVE_ENTRY_ADDED:
      return tassign(state, {
        entries: [...state.entries, action.payload.entries[0]]
      });

    case ACTION.PLAYLIST_ACTIVE_ENTRY_UPDATED:
      return tassign(state, {
        entries: state.entries
          .map(video => (video.uuid !== action.payload.entries[0].uuid) ? video : tassign(video, action.payload.entries[0]))
      });

    case ACTION.PLAYLIST_ACTIVE_ENTRY_REMOVED:
      return tassign(state, {
        entries: state.entries
          .filter(video => video.uuid !== action.payload.entries[0].uuid)
      });

    // case ACTION.PLAYLIST_ACTIVE_ENTRY_ACTIVATED:
    //   return tassign(state, {
    //     entries: state.entries
    //       .map(video => tassign(video, {
    //         playing: (video.uuid === action.payload.entries[0].uuid)
    //       }))
    //   });

    default:
      return state;
  }
}
