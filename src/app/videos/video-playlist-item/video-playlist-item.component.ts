import { Component, Input } from '@angular/core';
import { Video } from '../shared';
import { PlaylistService } from '../shared';


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

  constructor(private playlist: PlaylistService) {
  }
}
