import { Action } from '@ngrx/store';
import { Playlist } from './interfaces';
import { Video } from '../../video';


export const PLAYLIST_ENTRIES_REORDER = 'PLAYLIST_ENTRIES_REORDER';


export class PlaylistEntriesReorderAction implements Action {
    readonly type = PLAYLIST_ENTRIES_REORDER;
    readonly payload;
    constructor(videos: Video[]) {
        this.payload = videos;
    }
}