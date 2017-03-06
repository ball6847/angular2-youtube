import { Playlist, PlaylistState } from '../playlist';
import { Video } from '../video';


export interface IApplicationState {
  playlistList: Playlist[],
  playlistActive: Playlist,
  playlistState: PlaylistState,
  playlistEntries: Video[],
  searchResult: Video[],
  searchResultPage: number
};