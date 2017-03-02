import { Component } from "@angular/core";
import { AppState } from '../../shared/app-state.service';
import { PlaylistService } from '../shared/playlist.service';

@Component({
  selector: 'dl-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent {
  constructor(
    private appState: AppState,
    private playlistService: PlaylistService
  ) { }

  setupPlayer(player: YT.Player) {
    this.appState.player = player;
  }

  onStateChange(state) {
    this.playlistService.onPlayerStateChange(state);
  }
}
