import { Component } from '@angular/core';
import { PlaylistService } from '../shared/playlist.service';

@Component({
  selector: 'dl-video-playlist-loader',
  styleUrls: ['./video-playlist-loader.component.css'],
  templateUrl: './video-playlist-loader.component.html'
})
export class VideoPlaylistLoaderComponent {
  state = {
    playing: false,
    loop: false,
    shuffle: false
  };

  constructor(private playlistService: PlaylistService) { }

  ngOnInit() {
    this.playlistService.state()
      .subscribe(state => this.state = state);
  }

  next() {
    this.playlistService.next();
  }

  prev() {
    this.playlistService.prev();
  }

  togglePlay() {
    this.playlistService.togglePlay();
  }

  toggleShuffle() {
    this.playlistService.toggleShuffle();
  }

  toggleLoop() {
    this.playlistService.toggleLoop();
  }
}
