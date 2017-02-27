import { Component } from '@angular/core';
import { PlaylistService } from '../shared/playlist.service';

@Component({
  selector: 'dl-video-playlist',
  templateUrl: 'video-playlist.component.html',
  styleUrls: ['video-playlist.component.css']
})
export class VideoPlaylistComponent {
  constructor(private playlist: PlaylistService) { }
}
