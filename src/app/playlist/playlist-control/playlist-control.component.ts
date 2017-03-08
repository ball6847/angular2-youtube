import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PlaylistService } from '../shared';

@Component({
  selector: 'playlist-control',
  styleUrls: ['./playlist-control.component.css'],
  templateUrl: './playlist-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistControlComponent {
  state$;

  constructor(private playlistService: PlaylistService) { }

  ngOnInit() {
    this.state$ = this.playlistService.getState()
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
