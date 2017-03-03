import { Component } from '@angular/core';
import { PlaylistService } from '../shared';

@Component({
  selector: 'playlist-control',
  styleUrls: ['./playlist-control.component.css'],
  templateUrl: './playlist-control.component.html'
})
export class PlaylistControlComponent {
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
