

export class Playlist {
  id: string;
  name: string;
}

export class PlaylistStateInterface {
  playing = false;
  shuffle = false;
  loop = false;
  playlist = new Playlist();
}
