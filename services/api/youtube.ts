import axios from 'axios'
import YoutubeSearchResult from '../../models/youtube/YoutubeSearchResult'
import { YouTubeVideo } from '../../models/youtube/YoutubeVideo'
import { unescape } from '../utils/string'

const youtubeApiKeys = [
  'AIzaSyAXv-GO7k26oh9mXoWr_UjGM3SppWu15Z8', // btc-studio
  'AIzaSyCxMLRCWK7yQW2eH6E9xYZdFl-M4rylTAY', // persuasive-zoo-235913
  'AIzaSyCQ6SLch_P1nfZSssYe74P2M3a5YHrbais', // isling-m3
]
const randomApiKey = () =>
  youtubeApiKeys[Math.round(Math.random() * (youtubeApiKeys.length - 1))]

export const searchYoutubeVideo = async (keyword: string) => {
  const res = await axios({
    method: 'GET',
    url: 'https://www.googleapis.com/youtube/v3/search',
    params: {
      maxResults: 20,
      order: 'relevance',
      q: keyword,
      type: 'video',
      key: randomApiKey(),
    },
  })

  const videos: YoutubeSearchResult[] = res.data.items

  return videos
}

export const getYoutubeVideos = async (videoId: string) => {
  const res = await axios({
    method: 'GET',
    url: 'https://www.googleapis.com/youtube/v3/videos',
    params: {
      part: 'snippet,contentDetails',
      id: videoId,
      key: randomApiKey(),
    },
  })

  const videos: YouTubeVideo[] = res.data.items

  videos.forEach((item: YouTubeVideo) => {
    item.snippet.title = unescape(item.snippet.title)
  })

  return videos
}
