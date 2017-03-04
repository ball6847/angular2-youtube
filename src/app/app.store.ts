import { Action, ActionReducer } from '@ngrx/store';
import { Playlist, PlaylistState } from './playlist';
import * as playlistStore from './playlist/shared/reducer';

export interface AppState {
  playlists: Playlist[],
  activePlaylist: Playlist,
  playlistControlState: PlaylistState
};

export const AppReducer = {
  playlists: playlistStore.PlaylistListReducer,
  activePlaylist: playlistStore.PlaylistActiveReducer,
  playlistControlState: playlistStore.PlaylistControlStateReducer
};
