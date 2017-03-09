import { Component, ElementRef, OnInit, AfterContentInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Store } from '@ngrx/store';
import { IApplicationState } from '../../shared/interfaces';
import { PlaylistService, Playlist } from '../shared';
import { Video } from '../../video';
import { PlaylistActiveEntriesReorderedAction } from '../shared/store';


@Component({
  selector: 'playlist-entries',
  styleUrls: ['./playlist-entries.component.css'],
  templateUrl: './playlist-entries.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistEntriesComponent implements OnInit, AfterContentInit {
  // currenly opening playlist, we need entries from it
  playlist$: Observable<Playlist>

  // internal entries cache, need for syncing between dragula & store
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

    // we wil use playlist$.entries as data source for ngFor
    this.playlist$ = this.playlistService.getActive();

    // dragula cannot handle Observable so we need to keep a copy
    this.playlist$.subscribe(playlist => this.entries = playlist.entries);
  }

  ngAfterContentInit() {
    // prepare dragulaService, we need this setOptions call
    // otherwise dropModel event won't work as we expected
    this.dragulaService.setOptions('playlist', {
      mirrorContainer: this.elementRef.nativeElement
    });

    // when dragula update model
    // dispatch the reordered action to store in the background
    this.dragulaService.dropModel
      .subscribe(() => {
        if (this.entries.length > 1)
          this.store.dispatch(
            new PlaylistActiveEntriesReorderedAction(this.entries)
          );
      });
  }

  play(video: Video) {
    this.playlistService.play(video);
  }

  dequeue(video: Video) {
    this.playlistService.dequeue(video);
  }
}
