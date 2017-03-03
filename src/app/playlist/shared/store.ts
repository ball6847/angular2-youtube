import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as UUID from 'uuid-js';

import { Video } from '../../video';
import { PlaylistInterface, PlaylistStateInterface } from './model';
import { PlaylistService } from './service';
import { PlaylistTitleObservable } from './observable';

@Injectable()
export class PlaylistStoreService {
  private playlists$ = new PlaylistTitleObservable();
  private playlistCollection: Array<Video[]> = [];
  private state: PlaylistStateInterface;

  constructor(private playlistService: PlaylistService) {
    this.playlistService.state()
      .filter(state => {
        // detect playlist changes
        const changed = this.state && (this.state.playlist.id != state.playlist.id);
        this.state = Object.assign({}, state);
        return changed;
      })
      .subscribe(state => {
        // create playlist if neccessary
        if (this.playlistCollection[state.playlist.id] === undefined) {
          this.playlistCollection[state.playlist.id] = [];
        }
        // load playlist entries
        this.playlistService.entries()
          .next(this.playlistCollection[state.playlist.id]);
        this.playlistService.stop();
      });
  }

  getPlaylists() {
    return this.playlists$;
  }

  addPlaylist(name: string) {
    const playlists = this.playlists$.getValue();

    const playlist = {
      id: UUID.create().toString(),
      name: name
    };

    playlists.push(playlist);
    this.playlists$.next(playlists);

    this.playlistService.load(playlist);
  }

  getPlaylistEntries(playlistId: number) {

  }
}
