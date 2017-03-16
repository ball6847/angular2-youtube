import { Video } from '../../video'

export class PlaylistState {
  playing = false;
  shuffle = false;
  loop = false;
  video: Video = null;

  constructor(state?: Partial<PlaylistState>) {
    if (state && state.playing)
      this.playing = state.playing;

    if (state && state.loop)
      this.loop = state.loop

    if (state && state.shuffle)
      this.shuffle = state.shuffle

    if (state && state.video)
      this.video = state.video
  }
}
