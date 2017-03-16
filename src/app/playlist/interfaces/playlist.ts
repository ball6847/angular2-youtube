import { Video } from '../../video'

export class Playlist {
  id: string;
  uid?: string;
  name: string;
  entries: Video[] = [];
};
