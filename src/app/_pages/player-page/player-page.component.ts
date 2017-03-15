import { Component, ChangeDetectionStrategy } from "@angular/core";
import { PlaylistListService, ActivePlaylistService, PlaylistStateService } from '../../playlist'

@Component({
  selector: 'player-page',
  styleUrls: ['./player-page.component.css'],
  templateUrl: './player-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerPageComponent {
  constructor(
    protected playlistList: PlaylistListService,
    protected activePlaylist: ActivePlaylistService,
    protected playlistState: PlaylistStateService
  ) {}

  ngOnInit() {
    // player initial state from server
    this.playlistState.initialize();
    this.playlistList.initialize();
    this.activePlaylist.deactivate();
    this.activePlaylist.initialize();
  }
}
