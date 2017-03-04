import { Component } from '@angular/core';
import { PlaylistService } from "../shared";
import { Playlist } from "../shared";

@Component({
  selector: 'playlist-loader',
  styleUrls: ['./playlist-loader.component.css'],
  templateUrl: './playlist-loader.component.html'
})
export class PlaylistLoaderComponent {
  playlists: Playlist[];
  active: Playlist;

  constructor(private playlistService: PlaylistService) {
    this.playlistService.list()
      .subscribe(playlists => this.playlists = playlists);

    this.playlistService.playlist()
      .subscribe(playlist => this.active = playlist);
  }

  load(playlist: Playlist) {
    this.playlistService.load(playlist);
  }

  addPlaylist(name: any, popover: any): void {
    if (!name.value) {
      return;
    }

    // persist on service
    this.playlistService.create(name.value);

    // reset form and hide popover
    name.value = "";
    popover.hide();
  }
}
