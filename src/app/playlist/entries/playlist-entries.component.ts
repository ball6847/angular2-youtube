import { Component } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { Playlist, PlaylistService } from '../shared';
import { Video } from '../../video';

@Component({
  selector: 'playlist-entries',
  styleUrls: ['./playlist-entries.component.css'],
  templateUrl: './playlist-entries.component.html',
})
export class PlaylistEntriesComponent {
  playlist: Playlist;
  nowPlayingVideo: Video;

  constructor(
    private playlistService: PlaylistService,
    private dragulaService: DragulaService
  ) { }

  ngOnInit() {
    this.dragulaService.setOptions('playlist', {});

    this.playlistService.playlist()
      .subscribe(playlist => this.playlist = playlist);

    this.playlistService.nowPlaying()
      .subscribe(video => {
        this.nowPlayingVideo = video;
      });
  }

  play(index: number) {
    this.playlistService.play(index);
  }

  dequeue(index: number) {
    this.playlistService.dequeue(index);
  }
}
