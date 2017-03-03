import { Component } from '@angular/core';
import { PlaylistService } from "../shared";
import { PlaylistStoreService, PlaylistInterface } from "../shared";

@Component({
  selector: 'playlist-loader',
  styleUrls: ['./playlist-loader.component.css'],
  templateUrl: './playlist-loader.component.html'
})
export class PlaylistLoaderComponent {
  playlists: PlaylistInterface[];
  active: PlaylistInterface;

  constructor(
    private playlistStore: PlaylistStoreService,
    private playlistService: PlaylistService
  ) {
    this.playlistStore.getPlaylists()
      .subscribe(playlists => this.playlists = playlists);

    this.playlistService.state()
      .subscribe(state => this.active = state.playlist);

  }

  load(playlist: PlaylistInterface) {
    this.playlistService.load(playlist);
  }

  addPlaylist(name: any, popover: any): void {
    if (!name.value) {
      return;
    }

    // persist on service
    this.playlistStore.addPlaylist(name.value);

    // set active state
    // this.selectPlaylist(this.playlists.length - 1);

    // reset form and hide popover
    name.value = "";
    popover.hide();
  }
}
