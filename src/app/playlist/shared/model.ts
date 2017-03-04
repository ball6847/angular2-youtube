

export class Playlist {
  id: string;
  name: string;
}

export class PlaylistState {
  playing = false;
  shuffle = false;
  loop = false;
  playlist = new Playlist();
}
