import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Playlist, PlaylistStateInterface } from './model';
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

export class PlaylistStateObservable extends BehaviorSubject<PlaylistStateInterface> {
  constructor() {
    super(new PlaylistStateInterface());
  }
}

export class PlaylistTitleObservable extends BehaviorSubject<Playlist[]> {
  constructor() {
    super([]);
  }
}
