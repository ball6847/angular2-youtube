import { Component } from '@angular/core';
import { PlaylistService } from '../shared/playlist.service';

@Component({
  selector: 'dl-video-playlist-control',
  styleUrls: ['./video-playlist-control.component.css'],
  templateUrl: './video-playlist-control.component.html'
})
export class VideoPlaylistControlComponent {
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

  }

  toggleShuffle() {
    this.playlistService.toggleShuffle();
  }

  toggleLoop() {
    this.playlistService.toggleLoop();
  }
}
