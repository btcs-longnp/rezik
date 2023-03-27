interface Song {
  id: string
  title: string
  thumbnail: string
  duration?: number
}

export const newSong = (
  id: string,
  title: string,
  thumbnail: string,
  duration = 0
): Song => {
  const song: Song = {
    id,
    title,
    thumbnail,
    duration,
  }

  return song
}

export default Song
