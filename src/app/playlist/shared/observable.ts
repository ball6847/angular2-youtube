import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Playlist, PlaylistState } from './model';
import { Video } from '../../video';

class BehaviorSubjectOfArray<T> extends BehaviorSubject<T[]> {
  constructor() {
    super([]);
  }

  push(item: T): void {
    this.value.push(item);
    this.next(this.value);
  }

  remove(item: T) {
    const index = this.value.indexOf(item);
    if (index != -1) {
      this.value.splice(index, 1);
      this.next(this.value);
    }
  }
}

export class PlaylistEntriesObservable extends BehaviorSubjectOfArray<Video> { }
export class PlaylistListObservable extends BehaviorSubjectOfArray<Playlist> { }

export class PlaylistObservable extends BehaviorSubject<Playlist> {
  constructor() {
    super(new Playlist());
  }
}

export class PlaylistStateObservable extends BehaviorSubject<PlaylistState> {
  constructor() {
    super(new PlaylistState());
  }
}

export class PlaylistNowPlayingObservable extends BehaviorSubject<Video> {
  constructor() {
    super(undefined);
  }
}
