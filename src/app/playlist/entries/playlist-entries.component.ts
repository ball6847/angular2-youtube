import { Component } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Observable } from 'rxjs/Observable';
import { PlaylistService, PlaylistNowPlayingObservable } from '../shared';
import { Video } from '../../video';

// @TODO change to ngrx
@Component({
  selector: 'playlist-entries',
  styleUrls: ['./playlist-entries.component.css'],
  templateUrl: './playlist-entries.component.html',
})
export class PlaylistEntriesComponent {
  entries$: Observable<Video[]>;
  nowPlayingVideo$: PlaylistNowPlayingObservable;

  constructor(private playlistService: PlaylistService, dragulaService: DragulaService) {
    dragulaService.setOptions('playlist', {});
  }

  ngOnInit() {
    this.entries$ = this.playlistService.getEntries();
    this.nowPlayingVideo$ = this.playlistService.getNowPlaying();
  }

  play(video: Video) {
    this.playlistService.play(video);
  }

  dequeue(video: Video) {
    this.playlistService.dequeue(video);
  }
}
