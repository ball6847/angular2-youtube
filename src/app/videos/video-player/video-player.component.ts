import { Component, ElementRef, ViewChild } from "@angular/core";
import { AppState } from "../../shared/app-state.service";
// import { YoutubePlayerService } from 'ng2-youtube-player';


@Component({
  selector: 'dl-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent {
  player: YT.Player;

  constructor(private appState: AppState) { }

  ngOnInit() {

  }

  savePlayer(player) {
    this.player = player;
    console.log('player instance', player);
  }

  onStateChange(event) {
    console.log('player state', event.data);
  }
}
