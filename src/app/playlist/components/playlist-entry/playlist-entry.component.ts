import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

// @todo: find a way to isolate this
import { Video } from '../../../video';

@Component({
  selector: '[playlist-entry]',
  styleUrls: ['./playlist-entry.component.css'],
  templateUrl: './playlist-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistEntryComponent {
  @Input() video: Video;
  @Output() onPlay = new EventEmitter<Video>();
  @Output() onRemove = new EventEmitter<Video>();

  play(video: Video) {
    this.onPlay.emit(video);
  }

  remove(video: Video) {
    this.onRemove.emit(video);
  }
}
