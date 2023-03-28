import { useRef, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

import { newSongRequest } from '../../models/songRequest/SongRequest'
import PlaylistBox from '../../components/templates/playlistBox/PlaylistBox'
import { useRecoilValue } from 'recoil'
import Header from '../../components/templates/Header'
import { IoClose } from 'react-icons/io5'
import Song, { fromYoutubeVideo } from '../../models/song/Song'
import SongCardSimple from '../../components/organisms/SongCardSimple'
import { playlistStore } from '../../stores/playlist'
import { currentUserStore } from '../../stores/currentUser'
import { pushSongRequest } from '../../models/songRequest/Playlist'
import PlaylistRepository from '../../services/firestore/PlaylistRepository'
import IconButton from '../../components/atoms/IconButton'
import {
  getYoutubeVideos,
  searchYoutubeVideo,
} from '../../services/api/youtube'
import { YouTubeVideo } from '../../models/youtube/YoutubeVideo'

const playlistRepo = new PlaylistRepository('isling')
const youtubeVideoURLRegex =
  /^https:\/\/www.youtube.com\/watch\?v=(.*?)(?=&|$).*/

const Player: NextPage = () => {
  const playlist = useRecoilValue(playlistStore)
  const currentUser = useRecoilValue(currentUserStore)
  const [keyword, setKeyword] = useState<string>('')
  const keywordRef = useRef(keyword)
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeout = useRef<any>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const searchVideo = async () => {
    if (keywordRef.current === '') {
      return
    }

    console.log('search youtube: ', keywordRef.current)

    const matchYtbUrl = keywordRef.current.match(youtubeVideoURLRegex)

    if (matchYtbUrl) {
      const videos = await getYoutubeVideos(matchYtbUrl[1])

      setYoutubeVideos(videos)

      return
    }

    // Search by name
    const results = await searchYoutubeVideo(keywordRef.current)
    const videos = await getYoutubeVideos(
      results.map((item) => item.id.videoId).join(',')
    )

    setYoutubeVideos(videos)
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
                  key={video.id}
                  onClick={addSongRequest(fromYoutubeVideo(video))}
                >
                  <SongCardSimple song={fromYoutubeVideo(video)} />
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
