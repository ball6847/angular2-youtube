import { Component, Input } from '@angular/core';
import { Video } from '../shared';
import { PlaylistService } from '../shared';

@Component({
  selector: 'dl-video-playlist-item',
  templateUrl: 'video-playlist-item.component.html',
  styleUrls: ['video-playlist-item.component.css']
})
export class VideoPlaylistItemComponent {
  @Input()
  video: Video;

  constructor(private playlist: PlaylistService) {
  }
}
