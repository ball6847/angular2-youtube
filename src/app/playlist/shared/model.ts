import { Video } from '../../video'

export class Playlist {
  id: string;
  name: string;
  entries: Video[] = [];
}

export class PlaylistState {
  playing = false;
  shuffle = false;
  loop = false;
}
