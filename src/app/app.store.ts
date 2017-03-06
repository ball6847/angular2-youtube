import { ActionReducer, State, combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import { localStorageSync } from 'ngrx-store-localstorage';
import { Playlist, PlaylistState } from './playlist';
import { Video } from './video';
import * as fromPlaylist from './playlist/shared/reducer';
import * as fromSearch from './search/store';

export interface AppState {
  playlistList: Playlist[],
  playlistActive: Playlist,
  playlistState: PlaylistState,
  playlistEntries: Video[],
  searchResult: Video[],
  searchResultPage: number
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
  playlistList: fromPlaylist.PlaylistListReducer,
  playlistActive: fromPlaylist.PlaylistActiveReducer,
  playlistState: fromPlaylist.PlaylistControlStateReducer,
  playlistEntries: fromPlaylist.PlaylistEntriesReducer,
  searchResult: fromSearch.SearchResultReducer,
  searchResultPage: fromSearch.SearchResultPageReducer
});

export function AppReducer(state: any, action: any) {
  return reducer(state, action);
}