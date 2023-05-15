'use client'
import { useEffect, useMemo, useState } from 'react'

import { newSongRequest } from '@/models/songRequest/SongRequest'
import { useRecoilState, useRecoilValue } from 'recoil'
import Song, { fromYoutubeVideo } from '@/models/song/Song'
import SongCardSimple from '@com/organisms/SongCardSimple'
import { playlistStore } from '@/stores/playlist'
import { currentUserStore } from '@/stores/currentUser'
import { pushSongRequest } from '@/models/songRequest/Playlist'
import PlaylistRepository from '@/services/firestore/PlaylistRepository'
import { getYoutubeVideos, searchYoutubeVideo } from '@/services/api/youtube'
import { YouTubeVideo } from '@/models/youtube/YoutubeVideo'
import { searchQueryStore } from '@/stores/search'

const youtubeVideoURLRegex =
  /^(?:(?:https:\/\/)?(?:www.)?youtube.com\/watch\?v=(.*?)(?=&|$).*)|(?:(?:https:\/\/)?(?:.*?)\/(.*?)$)/

const Page = ({ params }: { params: Record<string, string> }) => {
  const playlist = useRecoilValue(playlistStore)
  const currentUser = useRecoilValue(currentUserStore)
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryStore)
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([])

  const roomId = (params?.id as string) || 'isling'

  const playlistRepo = useMemo(() => new PlaylistRepository(roomId), [roomId])

  const searchVideo = async (query: string) => {
    if (query === '') {
      return
    }

    const matchYtbUrl = query.match(youtubeVideoURLRegex)

    if (matchYtbUrl) {
      const videos = await getYoutubeVideos(matchYtbUrl[1] || matchYtbUrl[2])

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
    searchVideo(searchQuery)
    setSearchQuery('')
  }, [searchQuery, setSearchQuery])

  return (
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
  )
}

export default Page
