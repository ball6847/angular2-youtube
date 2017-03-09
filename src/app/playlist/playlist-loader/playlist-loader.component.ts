import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PlaylistService } from "../shared";
import { Playlist } from "../shared";

@Component({
  selector: 'playlist-loader',
  styleUrls: ['./playlist-loader.component.css'],
  templateUrl: './playlist-loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistLoaderComponent {
  list$: Observable<Playlist[]>
  active$: Observable<Playlist>;

  constructor(private playlistService: PlaylistService) { }

  ngOnInit() {
    this.list$ = this.playlistService.getList();
    this.active$ = this.playlistService.getActive()
  }

  load(playlist: Playlist) {
    this.playlistService.loadPlaylist(playlist);
  }

  create(name: any, popover: any) {
    if (!name.value)
      return;
    this.playlistService.createPlaylist(name.value);
    name.value = "";
    popover.hide();
  }

  rename(playlist$: Observable<Playlist>, name: any, popover: any) {
    playlist$
      .take(1)
      .subscribe(playlist => {
        if (!name.value)
          return;
        this.playlistService.renamePlaylist(playlist, name.value);
        name.value = "";
        popover.hide();
      });
  }

  delete(playlist$: Observable<Playlist>) {
    playlist$
      .take(1)
      .subscribe(playlist => {
        this.playlistService.deletePlaylist(playlist);
      });
  }
}
