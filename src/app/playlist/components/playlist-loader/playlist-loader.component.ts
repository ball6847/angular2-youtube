import 'rxjs/add/operator/take';

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PlaylistListService, ActivePlaylistService } from "../../stores";
import { Playlist } from "../../interfaces";

@Component({
  selector: 'playlist-loader',
  styleUrls: ['./playlist-loader.component.css'],
  templateUrl: './playlist-loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistLoaderComponent {
  list$: Observable<Playlist[]>
  active$: Observable<Playlist>;

  constructor(
    protected playlistList: PlaylistListService,
    protected activePlaylist: ActivePlaylistService
  ) { }

  ngOnInit() {
    this.list$ = this.playlistList.get();
    // @todo create playlistActiveService
    this.active$ = this.activePlaylist.get()
  }

  load(playlist: Playlist) {
    this.activePlaylist.activate(playlist);
  }

  create(name: any, popover: any) {
    if (!name.value)
      return;

    this.playlistList.create(name.value);

    name.value = "";
    popover.hide();
  }

  rename(playlist$: Observable<Playlist>, name: any, popover: any) {
    playlist$
      .take(1)
      .subscribe(playlist => {
        if (!name.value)
          return;
        this.playlistList.rename(playlist, name.value);
        name.value = "";
        popover.hide();
      });
  }

  delete(playlist$: Observable<Playlist>) {
    playlist$
      .take(1)
      .subscribe(playlist => {
        this.playlistList.delete(playlist);
      });
  }
}
