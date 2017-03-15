import { VideoDuration } from '../../video'

export class PlaylistEntry {
  uuid: string;
  videoId: string;
  title: string;
  duration: VideoDuration;
  ordering: number = 0;
}
