import { Component } from '@angular/core';
import { PlaylistService } from '../shared/playlist.service';
import { AppState } from "../../shared/app-state.service";


@Component({
  selector: 'dl-video-playlist',
  styleUrls: ['./video-playlist.component.css'],
  templateUrl: './video-playlist.component.html',
})
export class VideoPlaylistComponent {
  constructor(private playlist: PlaylistService, private appState: AppState) { }
}
