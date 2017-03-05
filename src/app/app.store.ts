import { Action, combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import { Playlist, PlaylistState } from './playlist';
import { Video } from './video';
import * as playlistStore from './playlist/shared/reducer';
import { localStorageSync } from 'ngrx-store-localstorage';

export interface AppState {
  playlistList: Playlist[],
  playlistActive: Playlist,
  playlistState: PlaylistState,
  playlistEntries: Video[],
};

export const AppReducer = compose(
  localStorageSync([
    'playlistList',
    'playlistActive',
    'playlistState',
    'playlistEntries'
  ], true),
  combineReducers
)({
  playlistList: playlistStore.PlaylistListReducer,
  playlistActive: playlistStore.PlaylistActiveReducer,
  playlistState: playlistStore.PlaylistControlStateReducer,
  playlistEntries: playlistStore.PlaylistEntriesReducer,
});