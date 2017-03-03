import { Component } from '@angular/core';
import { PlaylistStoreService, Playlist } from "../shared";

@Component({
  selector: 'playlist-loader',
  styleUrls: ['./playlist-loader.component.css'],
  templateUrl: './playlist-loader.component.html'
})
export class PlaylistLoaderComponent {
  playlists: Playlist[];

  active: {
    index: number,
    playlist: Playlist
  } = {
    index: undefined,
    playlist: undefined
  };

  constructor(private playlistStore: PlaylistStoreService) {
    this.playlistStore.getPlaylists()
      .subscribe(playlists => this.playlists = playlists);
  }

  selectPlaylist(playlist: Playlist) {

  }

  addPlaylist(name: any, popover: any): void {
    if (!name.value) {
      return;
    }

    // persist on service
    const playlist = new Playlist();
    playlist.name = name.value;
    this.playlistStore.addPlaylist(playlist);

    // set active state
    // this.selectPlaylist(this.playlists.length - 1);

    // reset form and hide popover
    name.value = "";
    popover.hide();
  }
}
