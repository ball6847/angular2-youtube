// not used at the moment
import { ActionReducer, State, combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import { localStorageSync } from 'ngrx-store-localstorage';
import {
  PlaylistListReducer,
  PlaylistActiveReducer,
  PlaylistControlStateReducer
} from './'


declare interface IPlaylistState {
  playlistList,
  playlistActive,
  playlistState
}

const reducer: ActionReducer<State<IPlaylistState>> = compose(
  localStorageSync([
    'playlistList',
    'playlistActive',
    'playlistState'
  ], true),
  combineReducers
)({
  playlistList: PlaylistListReducer,
  playlistActive: PlaylistActiveReducer,
  playlistState: PlaylistControlStateReducer,
});

export function PlaylistReducer(state: any, action: any) {
  return reducer(state, action);
}
