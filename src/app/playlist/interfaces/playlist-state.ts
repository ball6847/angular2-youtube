import { Video } from '../../video'

export class PlaylistState {
  playing = false;
  shuffle = false;
  loop = false;
  video: Video;
}
