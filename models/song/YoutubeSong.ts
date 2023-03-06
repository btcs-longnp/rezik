interface YoutubeSong {
  id: string
  title: string
  thumbnail: string
  duration?: number
}

export const newYoutubeSong = (
  id: string,
  title: string,
  thumbnail: string,
  duration?: number
): YoutubeSong => {
  const song: YoutubeSong = {
    id,
    title,
    thumbnail,
    duration,
  }

  return song
}

export default YoutubeSong
