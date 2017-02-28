import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Video } from '../shared';

@Component({
  selector: 'dl-video-playlist-item',
  styleUrls: ['./video-playlist-item.component.css'],
  templateUrl: './video-playlist-item.component.html'
})
export class VideoPlaylistItemComponent {
  @Input()
  video: Video;

  @Input()
  index: number;

  @Output()
  play = new EventEmitter<Video>();

  @Output()
  remove = new EventEmitter<number>();

  doPlay() {
    this.play.emit(this.video);
  }

  doRemove() {
    this.remove.emit(this.index);
  }
}
