import { Component, ChangeDetectionStrategy } from "@angular/core";
import { AngularFire } from 'angularfire2';
import { ActivatedRoute } from '@angular/router';
import { PlaylistListService, ActivePlaylistService, PlaylistStateService, PlaylistOwnerService } from '../../playlist'

@Component({
  selector: 'player-page',
  styleUrls: ['./player-page.component.css'],
  templateUrl: './player-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerPageComponent {
  constructor(
    protected af: AngularFire,
    protected route: ActivatedRoute,
    protected playlistOwner: PlaylistOwnerService,
    protected playlistList: PlaylistListService,
    protected activePlaylist: ActivePlaylistService,
    protected playlistState: PlaylistStateService
  ) {
    // this.route.params.subscribe(console.log);
    // this.resetComponentState();
    this.playlistOwner.set(
      this.route.params.map(params => params['roomId'])
    );

  }

  ngOnInit() {
    // player initial state from server
    this.route.params.subscribe(params => {
      this.playlistState.initialize();
      this.playlistList.initialize();
      this.activePlaylist.deactivate();
      this.activePlaylist.initialize();
    });
  }
}
