import { Component } from "@angular/core";
import { AppService } from '../app.service';
import { PlaylistService } from '../playlist';

@Component({
  selector: 'video-player',
  styleUrls: ['./video.component.css'],
  templateUrl: './video.component.html'
})
export class VideoComponent {
  constructor(
    private appService: AppService,
    private playlistService: PlaylistService
  ) { }

  setupPlayer(player: YT.Player) {
    this.appService.player = player;
  }

  onStateChange(state) {
    this.playlistService.onPlayerStateChange(state);
  }
}
