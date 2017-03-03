

export class PlaylistInterface {
  id: string;
  name: string;
}

export class PlaylistStateInterface {
  playing = false;
  shuffle = false;
  loop = false;
  playlist = new PlaylistInterface();
}
