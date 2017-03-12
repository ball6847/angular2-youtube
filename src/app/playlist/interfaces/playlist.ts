import { Video } from '../../video'

export class Playlist {
  id: string;
  name: string;
  entries: Video[] = [];
}
