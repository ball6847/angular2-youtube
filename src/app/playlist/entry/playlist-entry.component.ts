import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Video } from '../../video';

@Component({
  selector: 'playlist-entry',
  styleUrls: ['./playlist-entry.component.css'],
  templateUrl: './playlist-entry.component.html'
})
export class PlaylistEntryComponent {
  @Input() video: Video;
  @Input() index: number;
  @Output() play = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();

  doPlay() {
    this.play.emit(this.index);
  }

  doRemove() {
    this.remove.emit(this.index);
  }
}
