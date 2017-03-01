import { Component } from '@angular/core';
import { PlaylistService } from '../shared/playlist.service';
import { Video } from '../shared/video.model';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

@Component({
  selector: 'dl-video-playlist',
  styleUrls: ['./video-playlist.component.css'],
  templateUrl: './video-playlist.component.html',
})
export class VideoPlaylistComponent {
  items: Video[];
  nowPlayingVideo: Video;

  constructor(
    private playlistService: PlaylistService,
    private dragulaService: DragulaService
  ) { }

  ngOnInit() {
    this.dragulaService.setOptions('playlist', {});

    this.playlistService.entries()
      .subscribe(items => this.items = items);

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
