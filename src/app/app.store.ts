import { ActionReducer, State, combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import { localStorageSync } from 'ngrx-store-localstorage';
import { Playlist, PlaylistState } from './playlist';
import { Video } from './video';
import * as playlistStore from './playlist/shared/reducer';

export interface AppState {
  playlistList: Playlist[],
  playlistActive: Playlist,
  playlistState: PlaylistState,
  playlistEntries: Video[],
};

const reducer: ActionReducer<State<AppState>> = compose(
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

export function AppReducer(state: any, action: any) {
  return reducer(state, action);
}