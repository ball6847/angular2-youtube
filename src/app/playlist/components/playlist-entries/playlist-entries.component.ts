import { Component, ElementRef, OnInit, AfterContentInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Store } from '@ngrx/store';
import { Playlist } from '../../interfaces';
import { PlaylistService } from '../../services';
import { ActivePlaylistService } from '../../stores';

// @todo: find a way to isolate these two dependencies
import { IApplicationState } from '../../../shared/interfaces';
import { Video } from '../../../video';


@Component({
  selector: 'playlist-entries',
  styleUrls: ['./playlist-entries.component.css'],
  templateUrl: './playlist-entries.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaylistEntriesComponent implements OnInit, AfterContentInit {
  /**
   * currenly opening playlist, we need entries from it
   */
  playlist$: Observable<Playlist>

  /**
   * internal entries cache, need for syncing between dragula & store
   */
  entries: Video[] = [];

  /**
   * currently playing video
   */
  video$: Observable<Video>;

  entries$: Observable<Video[]>;

  /**
   * Dragula Bag
   */
  bagname = 'playlist'

  constructor(
    private store: Store<IApplicationState>,
    private playlistService: PlaylistService,
    private dragulaService: DragulaService,
    private elementRef: ElementRef,
    private activePlaylist: ActivePlaylistService
  ) {}

  /**
   * create property binding many service
   *
   * we wil use playlist$.entries as data source for ngFor
   * dragula cannot handle Observable so we need to keep a copy
   */
  ngOnInit() {
    // @todo move this liine to playlistStateService
    this.video$ = this.store.select(state => state.playlistState.video);

    this.playlist$ = this.activePlaylist.get();

    this.entries$ = this.activePlaylist.activePlaylistApi.listEntries();

    this.entries$.subscribe(entries => {
      this.entries = entries;
    });

  }


  /**
   * prepare dragulaService, we need this setOptions call
   * otherwise dropModel event won't work as we expected
   *
   * when dragula update model
   * dispatch the reordered action to store in the background
   */
  ngAfterContentInit() {
    this.dragulaService.setOptions(this.bagname, {
      mirrorContainer: this.elementRef.nativeElement
    });

    this.dragulaService.dropModel
      .subscribe(() => {
        if (this.entries.length > 1)
          this.activePlaylist.saveOrdering(this.entries);
      });
  }

  /**
   * Dragular instance cannot initialize more than once
   * So we need to destroy it when component is not using
   */
  ngOnDestroy() {
    this.dragulaService.destroy(this.bagname);
  }

  /**
   * Play the video
   *
   * @param video
   */
  play(video: Video) {
    this.playlistService.play(video);
  }

  /**
   *  Remove video from the list
   *
   * @param video
   */
  dequeue(video: Video) {
    this.playlistService.dequeue(video);
  }
}
