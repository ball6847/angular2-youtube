

export class Playlist {
  id: string;
  name: string;
}

export interface PlaylistState {
  playing: boolean;
  shuffle: boolean;
  loop: boolean
}
