import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Title } from '@angular/platform-browser';
// import { Observable } from 'rxjs/Observable';
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
  // roomId$: Observable<number>;

  constructor(
    protected title: Title,
    protected af: AngularFire,
    protected route: ActivatedRoute,
    protected owner: PlaylistOwnerService,
    protected playlistList: PlaylistListService,
    protected activePlaylist: ActivePlaylistService,
    protected playlistState: PlaylistStateService
  ) {
    this.owner.set(
      this.route.params.map(params => params['roomId'])
    );
  }

  ngOnInit() {
    // this.af.database.object()
    //   .take(1)
    //   .do(auth => this.title.setTitle(`${auth.auth.displayName}'s room - Youtube Player`))
    //   .subscribe();

    // this.title.setTitle();
    // player initial state from server
    this.playlistState.initialize();
    this.playlistList.initialize();
    this.activePlaylist.deactivate();
    this.activePlaylist.initialize();
  }
}
