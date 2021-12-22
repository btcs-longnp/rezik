interface YoutubeSong {
  id: string;
  title: string;
  thumbnail?: string;
}

export const newYoutubeSong = (
  id: string,
  title: string,
  thumbnail?: string
): YoutubeSong => {
  let song: YoutubeSong = {
    id,
    title,
  };

  if (thumbnail) {
    song.thumbnail = thumbnail;
  }

  return song;
};

export default YoutubeSong;
