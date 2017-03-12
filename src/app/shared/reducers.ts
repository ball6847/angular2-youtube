import { ActionReducer, State, combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import { localStorageSync } from 'ngrx-store-localstorage';
import { IApplicationState } from '../shared/interfaces';
import * as playlist from '../playlist/stores';
import * as search from '../search/shared/reducers';

const reducer: ActionReducer<State<IApplicationState>> = compose(
  localStorageSync([
    // 'playlistList',
    // 'playlistActive',
    // 'playlistState'
  ], true),
  combineReducers
)({
  playlistList: playlist.PlaylistListReducer,
  playlistActive: playlist.PlaylistActiveReducer,
  playlistState: playlist.PlaylistControlStateReducer,
  playlistEntries: playlist.PlaylistEntriesReducer,
  searchResult: search.SearchResultReducer,
  searchResultPage: search.SearchResultPageReducer
});

export function AppReducer(state: any, action: any) {
  return reducer(state, action);
}
