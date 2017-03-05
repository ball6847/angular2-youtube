import { Action, ActionReducer } from '@ngrx/store';
import { Playlist, PlaylistState } from './playlist';
import { Video } from './video';
import * as playlistStore from './playlist/shared/reducer';



export interface AppState {
  playlistList: Playlist[],
  playlistActive: Playlist,
  playlistState: PlaylistState,
  playlistEntries: Video[]
};

export const AppReducer = {
  playlistList: playlistStore.PlaylistListReducer,
  playlistActive: playlistStore.PlaylistActiveReducer,
  playlistState: playlistStore.PlaylistControlStateReducer,
  playlistEntries: playlistStore.PlaylistEntriesReducer
};
