import { YouTubeVideo } from '../youtube/YoutubeVideo'

interface Song {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  channelTitle: string
}

export default Song

export const newSong = (
  id: string,
  title: string,
  description: string,
  thumbnail: string,
  duration: string,
  channelTitle: string
): Song => {
  const song: Song = {
    id,
    title,
    description,
    thumbnail,
    duration,
    channelTitle,
  }

  return song
}

export const fromYoutubeVideo = (video: YouTubeVideo) => {
  let duration = video.contentDetails.duration
  const match = duration.match(/^PT((\d+)H)?((\d+)M)?((\d+)S)?$/)

  if (match) {
    const hour = match[2] ? `${match[2]}:` : ''
    const min = (match[4] || '0').padStart(2, '0')
    const sec = (match[6] || '0').padStart(2, '0')

    duration = `${hour}${min}:${sec}`
  }

  return newSong(
    video.id,
    video.snippet.title,
    video.snippet.description,
    video.snippet.thumbnails.high.url,
    duration,
    video.snippet.channelTitle
  )
}
