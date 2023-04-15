import { useEffect, useMemo, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

import { newSongRequest } from '../../../../models/songRequest/SongRequest'
import PlaylistBox from '../../../../components/templates/playlistBox/PlaylistBox'
import { useRecoilState, useRecoilValue } from 'recoil'
import RoomHeader from '../../../../components/templates/headers/RoomHeader'
import Song, { fromYoutubeVideo } from '../../../../models/song/Song'
import SongCardSimple from '../../../../components/organisms/SongCardSimple'
import { playlistStore } from '../../../../stores/playlist'
import { currentUserStore } from '../../../../stores/currentUser'
import { pushSongRequest } from '../../../../models/songRequest/Playlist'
import PlaylistRepository from '../../../../services/firestore/PlaylistRepository'
import {
  getYoutubeVideos,
  searchYoutubeVideo,
} from '../../../../services/api/youtube'
import { YouTubeVideo } from '../../../../models/youtube/YoutubeVideo'
import { searchQueryStore } from '../../../../stores/search'
import { useRouter } from 'next/router'
import { getRoomById } from '../../../../services/room/room'
import { Room } from '../../../../models/room/Room'

const youtubeVideoURLRegex =
  /^https:\/\/www.youtube.com\/watch\?v=(.*?)(?=&|$).*/

const Search: NextPage = () => {
  const playlist = useRecoilValue(playlistStore)
  const currentUser = useRecoilValue(currentUserStore)
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryStore)
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([])
  const router = useRouter()
  const [room, setRoom] = useState<Room>()

  const roomId = (router.query.id as string) || 'isling'

  const playlistRepo = useMemo(() => new PlaylistRepository(roomId), [roomId])

  const searchVideo = async (query: string) => {
    if (query === '') {
      return
    }

    console.log('search youtube: ', query)

    const matchYtbUrl = query.match(youtubeVideoURLRegex)

    if (matchYtbUrl) {
      const videos = await getYoutubeVideos(matchYtbUrl[1])

      setYoutubeVideos(videos)

      return
    }

    // Search by name
    const results = await searchYoutubeVideo(query)
    const videos = await getYoutubeVideos(
      results.map((item) => item.id.videoId).join(',')
    )

    setYoutubeVideos(videos)
  }

  const addSongRequest = (youtubeSong: Song) => async () => {
    const songRequest = newSongRequest(youtubeSong, currentUser)
    const newPlaylist = pushSongRequest(playlist, songRequest)
    console.log(newPlaylist)
    await playlistRepo.setPlaylist(newPlaylist)
  }

  useEffect(() => {
    if (!roomId || typeof roomId !== 'string') {
      setRoom(undefined)
      return
    }

    const room = getRoomById(roomId)
    setRoom(room)
  }, [roomId])

  useEffect(() => {
    searchVideo(searchQuery)
    setSearchQuery('')
  }, [searchQuery, setSearchQuery])

  return (
    <div>
      <Head>
        <title>{`${room?.name} — isling`}</title>
        <meta name="description" content="Let's watch videos together" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div id="video-wrapper" className="relative bg-primary">
          <header className="fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary z-40">
            <RoomHeader room={room} />
          </header>
          <div className="fixed top-[4.5rem] right-6 overflow-hidden lg:rounded-xl lg:h-[calc(100vh-6rem)] lg:w-[26rem]">
            <PlaylistBox hasMiniPlayer />
          </div>
          <div className="pl-6 pr-[32rem] overflow-auto">
            <div className="lg:h-[4.5rem]" />
            <div className="space-y-4">
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

export default Search
