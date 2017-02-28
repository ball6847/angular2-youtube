import { Component, Input } from '@angular/core';
import { PlaylistService } from '../shared/playlist.service';
import { YoutubePlayerService } from 'ng2-youtube-player';
import { Video } from '../shared/video.model';
import { AppState } from "../../shared/app-state.service";


@Component({
  selector: 'dl-video-playlist',
  styleUrls: ['./video-playlist.component.css'],
  templateUrl: './video-playlist.component.html',
})
export class VideoPlaylistComponent {
  @Input()
  player: YT.Player;

  constructor(
    private playlistService: PlaylistService,
    private appState: AppState,
    private playerService: YoutubePlayerService
  ) { }

  play(video: Video) {
    this.playerService.playVideo({ id: video.videoId }, this.player);
  }

  dequeue(index: number) {
    this.playlistService.dequeue(index);
  }
}
