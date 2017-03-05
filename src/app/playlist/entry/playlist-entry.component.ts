import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Video } from '../../video';

@Component({
  selector: 'playlist-entry',
  styleUrls: ['./playlist-entry.component.css'],
  templateUrl: './playlist-entry.component.html'
})
export class PlaylistEntryComponent {
  @Input() video: Video;
  @Output() play = new EventEmitter<Video>();
  @Output() remove = new EventEmitter<Video>();

  doPlay() {
    this.play.emit(this.video);
  }

  doRemove() {
    this.remove.emit(this.video);
  }
}
