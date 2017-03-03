import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as UUID from 'uuid-js';

import { Video } from '../../video';
import { Playlist } from './model';
import { PlaylistTitleObservable } from './observable';

@Injectable()
export class PlaylistStoreService {
  private playlists$ = new PlaylistTitleObservable();



  getPlaylists() {
    return this.playlists$;
  }

  addPlaylist(playlist: Playlist) {
    const playlists = this.playlists$.getValue();

    // attach playlist uuid
    playlist.id = UUID.create().toString();

    playlists.push(playlist);
    this.playlists$.next(playlists);
  }

  getPlaylistEntries(playlistId: number) {

  }
}
