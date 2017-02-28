import { Component } from '@angular/core';
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
  constructor(
    private appState: AppState,
    private playlistService: PlaylistService,
    private playerService: YoutubePlayerService
  ) { }

  play(index: number) {
    this.playlistService.play(index);
  }

  dequeue(index: number) {
    this.playlistService.dequeue(index);
  }
}
