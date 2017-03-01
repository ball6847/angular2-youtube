import { Component } from '@angular/core';
import { PlaylistService } from '../shared/playlist.service';
import { YoutubePlayerService } from 'ng2-youtube-player';
import { Video } from '../shared/video.model';
import { AppState } from "../../shared/app-state.service";
import { DragulaService } from 'ng2-dragula/ng2-dragula';

@Component({
  selector: 'dl-video-playlist',
  styleUrls: ['./video-playlist.component.css'],
  templateUrl: './video-playlist.component.html',
})
export class VideoPlaylistComponent {
  items: Video[];

  constructor(
    private appState: AppState,
    private playlistService: PlaylistService,
    private playerService: YoutubePlayerService,
    private dragulaService: DragulaService
  ) {
    this.dragulaService.setOptions('first-bag', {});
  }

  ngOnInit() {
    this.playlistService.items()
      .subscribe(items => this.items = items);
  }

  play(index: number) {
    this.playlistService.play(index);
  }

  dequeue(index: number) {
    this.playlistService.dequeue(index);
  }
}
