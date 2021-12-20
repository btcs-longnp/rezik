import SongRequest from './SongRequest';

interface PlayList {
  list: SongRequest[];
  version: number;
}

export const newPlayList = (list: SongRequest[], version: number): PlayList => {
  return {
    list,
    version,
  };
};

export const pushSongRequest = (
  playlist: PlayList,
  songRequest: SongRequest
): PlayList => {
  return {
    ...playlist,
    list: [...playlist.list, songRequest],
  };
};

export const commitPlayList = (playlist: PlayList): PlayList => {
  return {
    ...playlist,
    version: playlist.version + 1,
  };
};

export default PlayList;
