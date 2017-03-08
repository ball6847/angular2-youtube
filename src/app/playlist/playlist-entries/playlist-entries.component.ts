import { Component, ElementRef, OnInit, AfterContentInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Store } from '@ngrx/store';
import { IApplicationState } from '../../shared/interfaces';
import { PlaylistService } from '../shared';
import { Video } from '../../video';
import { PlaylistEntriesReorderedAction } from '../shared/store';


@Component({
  selector: 'playlist-entries',
  styleUrls: ['./playlist-entries.component.css'],
  templateUrl: './playlist-entries.component.html',
})
export class PlaylistEntriesComponent implements OnInit, AfterContentInit {
  // currenly opening playlist entries
  entries: Video[] = [];

  // currently playing video
  video$: Observable<Video>;

  constructor(
    private store: Store<IApplicationState>,
    private playlistService: PlaylistService,
    private dragulaService: DragulaService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.video$ = this.store.select(state => state.playlistState.video);

    // please note, we cannot directly bind Observable from getEntries() to component's property
    // since we need one model to keep track of dragula action
    // we can then dispatch those value back to store
    this.playlistService.getEntries()
      .subscribe(videos => {
        this.entries = videos.slice();
      });
  }

  ngAfterContentInit() {
    // prepare dragulaService, we need this setOptions call
    // otherwise dropModel event won't work as we expected
    this.dragulaService.setOptions('playlist', {
      mirrorContainer: this.elementRef.nativeElement
    });

    // when dragula update model
    // dispatch the reordered action to store
    this.dragulaService.dropModel
      .subscribe(() => {
        if (this.entries.length > 1)
          this.store.dispatch(new PlaylistEntriesReorderedAction(this.entries));
      });
  }

  play(video: Video) {
    this.playlistService.play(video);
  }

  dequeue(video: Video) {
    this.playlistService.dequeue(video);
  }
}
