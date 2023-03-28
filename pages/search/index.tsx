import { useRef, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

import { newSongRequest } from '../../models/songRequest/SongRequest'
import PlaylistBox from '../../components/templates/playlistBox/PlaylistBox'
import { useRecoilValue } from 'recoil'
import Header from '../../components/templates/Header'
import { IoClose } from 'react-icons/io5'
import Song, { newSong } from '../../models/song/Song'
import SongCardSimple from '../../components/organisms/SongCardSimple'
import YoutubeSearchResult from '../../models/youtube/YoutubeSearchResult'
import axios from 'axios'
import { playlistStore } from '../../stores/playlist'
import { currentUserStore } from '../../stores/currentUser'
import { pushSongRequest } from '../../models/songRequest/Playlist'
import PlaylistRepository from '../../services/firestore/PlaylistRepository'
import IconButton from '../../components/atoms/IconButton'
import { unescape } from '../../services/utils/string'

const playlistRepo = new PlaylistRepository('isling')
const youtubeApiKeys = [
  'AIzaSyAXv-GO7k26oh9mXoWr_UjGM3SppWu15Z8', // btc-studio
  'AIzaSyCxMLRCWK7yQW2eH6E9xYZdFl-M4rylTAY', // persuasive-zoo-235913
  'AIzaSyCQ6SLch_P1nfZSssYe74P2M3a5YHrbais', // isling-m3
]
const randomApiKey = () =>
  youtubeApiKeys[Math.round(Math.random() * (youtubeApiKeys.length - 1))]

const Player: NextPage = () => {
  const playlist = useRecoilValue(playlistStore)
  const currentUser = useRecoilValue(currentUserStore)
  const [keyword, setKeyword] = useState<string>('')
  const keywordRef = useRef(keyword)
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeSearchResult[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeout = useRef<any>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const searchVideo = () => {
    if (keywordRef.current === '') {
      return
    }

    console.log('search youtube: ', keywordRef.current)

    axios({
      method: 'GET',
      url: 'https://www.googleapis.com/youtube/v3/search',
      params: {
        part: 'snippet',
        maxResults: 20,
        order: 'relevance',
        q: keywordRef.current,
        type: 'video',
        key: randomApiKey(),
      },
    }).then((response) => {
      response.data.items.forEach((item: YoutubeSearchResult) => {
        item.snippet.title = unescape(item.snippet.title)
      })

      setYoutubeVideos(response.data.items)
    })
  }

  const handleChangeKeyword = (value: string) => {
    setKeyword(value)
    keywordRef.current = value

    if (timeout.current) {
      clearTimeout(timeout.current)
    }

    timeout.current = setTimeout(function () {
      searchVideo()
      timeout.current = undefined
    }, 800)
  }

  const handleClearKeyword = () => {
    setKeyword('')
    searchInputRef.current?.focus()
  }

  const addSongRequest = (youtubeSong: Song) => async () => {
    const songRequest = newSongRequest(youtubeSong, currentUser)
    const newPlaylist = pushSongRequest(playlist, songRequest)
    console.log(newPlaylist)
    await playlistRepo.setPlaylist(newPlaylist)
  }

  return (
    <div>
      <Head>
        <title>isling - Watch Video Together</title>
        <meta name="description" content="Let's watch videos together" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="relative bg-primary">
          <div className="fixed z-[999] left-1/2 -translate-x-1/2 h-14 flex justify-center items-center text-secondary">
            <div className="w-[34rem] rounded-full border border-primary-light flex items-center pr-2">
              <input
                ref={searchInputRef}
                value={keyword}
                placeholder="Search or type Youtube URL"
                className="w-full pl-4 py-2 outline-none bg-transparent font-light"
                onChange={({ target: { value } }) => handleChangeKeyword(value)}
              />
              {keyword.length > 0 && (
                <IconButton onClick={handleClearKeyword}>
                  <IoClose className="text-secondary/50 hover:text-secondary text-lg" />
                </IconButton>
              )}
            </div>
          </div>
          <header className="fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary z-40">
            <Header page="search" />
          </header>
          <div className="fixed top-[4.5rem] right-6 overflow-hidden lg:rounded-xl lg:h-[calc(100vh-6rem)] lg:w-[26rem]">
            <PlaylistBox />
          </div>
          <div className="pl-6 pr-[32rem] overflow-auto">
            <div className="lg:h-[4.5rem]" />
            <div className=" space-y-4">
              {youtubeVideos.map((video) => (
                <div
                  className="cursor-pointer"
                  key={video.id.videoId}
                  onClick={addSongRequest(
                    newSong(
                      video.id.videoId,
                      video.snippet.title,
                      video.snippet.thumbnails.high.url
                    )
                  )}
                >
                  <SongCardSimple
                    song={newSong(
                      video.id.videoId,
                      video.snippet.title,
                      video.snippet.thumbnails.high.url
                    )}
                  />
                </div>
              ))}
            </div>
            <div className="lg:h-20" />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Player
