import { ulid } from 'ulid';
import YoutubeSong from '../song/YoutubeSong';
import User from '../user/User';

interface SongRequest {
  id: string;
  song: YoutubeSong;
  user: User;
  requestTime: Date;
}

export const newSongRequest = (song: YoutubeSong, user: User): SongRequest => {
  return {
    id: ulid(),
    song,
    user,
    requestTime: new Date(),
  };
};

export default SongRequest;
