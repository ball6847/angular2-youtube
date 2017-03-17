import { ActionReducer, State, combineReducers } from '@ngrx/store';
import { compose } from '@ngrx/core/compose';
import { localStorageSync } from 'ngrx-store-localstorage';
import { IApplicationState } from '../shared/interfaces';
import * as fromPlaylist from '../playlist/stores';
import * as fromSearch from '../search/shared/reducers';

const reducer: ActionReducer<State<IApplicationState>> = compose(
  localStorageSync([
    // 'playlistList',
    // 'playlistActive',
    // 'playlistState',
    // 'playlistEntries'
  ], true),
  combineReducers
)({
  playlistList: fromPlaylist.PlaylistListReducer,
  playlistActive: fromPlaylist.PlaylistActiveReducer,
  playlistState: fromPlaylist.PlaylistStateReducer,
  playlistEntries: fromPlaylist.PlaylistEntriesReducer,
  searchResult: fromSearch.SearchResultReducer,
  searchResultPage: fromSearch.SearchResultPageReducer
});

export function AppReducer(state: any, action: any) {
  return reducer(state, action);
}
