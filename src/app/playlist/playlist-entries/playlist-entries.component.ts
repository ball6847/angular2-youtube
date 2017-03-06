import { Component } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Observable } from 'rxjs/Observable';
import { PlaylistService } from '../shared';
import { Video } from '../../video';

@Component({
  selector: 'playlist-entries',
  styleUrls: ['./playlist-entries.component.css'],
  templateUrl: './playlist-entries.component.html',
})
export class PlaylistEntriesComponent {
  entries$: Observable<Video[]>;

  constructor(private playlistService: PlaylistService, dragulaService: DragulaService) {
    dragulaService.setOptions('playlist', {});
  }

  ngOnInit() {
    this.entries$ = this.playlistService.getEntries();
  }

  play(video: Video) {
    this.playlistService.play(video);
  }

  dequeue(video: Video) {
    this.playlistService.dequeue(video);
  }
}
