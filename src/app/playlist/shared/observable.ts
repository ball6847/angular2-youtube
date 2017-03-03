import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Playlist, PlaylistState } from './model';
import { Video } from '../../video';

export class PlaylistEntriesObservable extends BehaviorSubject<Video[]> {
  constructor() {
    super([]);
  }
}

export class PlaylistNowPlayingObservable extends BehaviorSubject<Video> {
  constructor() {
    super(undefined);
  }
}

export class PlaylistStateObservable extends BehaviorSubject<PlaylistState> {
  constructor() {
    super({
      playing: false,
      loop: false,
      shuffle: false
    });
  }
}

export class PlaylistTitleObservable extends BehaviorSubject<Playlist[]> {
  constructor() {
    super([]);
  }
}
