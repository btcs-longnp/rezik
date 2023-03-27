import { useEffect, useRef, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import ReactPlayer from 'react-player'

import SongRequest, {
  newSongRequest,
} from '../../models/songRequest/SongRequest'
import PlaylistBox from '../../components/templates/playlistBox/PlaylistBox'
// import { playerEvent } from '../../models/eventEmitter/player'
import { useRecoilValue } from 'recoil'
// import { isPlayingStore } from '../../stores/player'
import Header from '../../components/templates/Header'
import { IoClose } from 'react-icons/io5'
// import ReactionPool from '../../components/templates/ReactionPool'
// import { emitAddReaction } from '../../services/emitter/reactionEmitter'
// import PlayerStateRepository, {
//   SnapshotReactionHandler,
// } from '../../services/firestore/PlayerStateRepository'
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

// const youtubeVideoBaseUrl = 'https://www.youtube.com/watch?v='
// const playerRepo = new PlayerStateRepository('isling')
const playlistRepo = new PlaylistRepository('isling')

const Player: NextPage = () => {
  const playlist = useRecoilValue(playlistStore)
  const player = useRef<ReactPlayer>(null)
  const currentUser = useRecoilValue(currentUserStore)
  // const [isPlaying, setIsPlaying] = useRecoilState(isPlayingStore)
  const [curSongReq, setCurSongReq] = useState<SongRequest>()
  // const playerRef = useRef<HTMLDivElement>(null)
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
        key: 'AIzaSyCxMLRCWK7yQW2eH6E9xYZdFl-M4rylTAY',
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

  // const onReady = () => {
  //   console.log('player: onReady')
  //   setIsPlaying(true)
  // }

  // const handleVideoEndOrError = () => {
  //   playerEvent.emit('ended')
  // }

  // const onPlay = () => {
  //   console.log('onPlay')
  //   setIsPlaying(true)
  // }

  // const onPause = () => {
  //   console.log('onPause')
  //   setIsPlaying(false)
  // }

  // const miniPlayer = (
  //   <div ref={playerRef} className="overflow-hidden lg:w-full lg:aspect-video">
  //     {curSongReq ? (
  //       <ReactPlayer
  //         ref={player}
  //         url={youtubeVideoBaseUrl + curSongReq.song.id}
  //         playing={isPlaying}
  //         controls={true}
  //         onPlay={onPlay}
  //         onPause={onPause}
  //         onEnded={handleVideoEndOrError}
  //         onError={handleVideoEndOrError}
  //         onReady={onReady}
  //         width="100%"
  //         height="100%"
  //       />
  //     ) : (
  //       <div className="h-full grid grid-rows-[auto_1fr_auto]">
  //         <div className="h-20 bg-black" />
  //         <div className="h-full bg-gray-400 grid place-items-center">
  //           <IoPlay className="text-9xl text-primary-light animate-pulse duration-300" />
  //         </div>
  //         <div className="h-20 bg-black" />
  //       </div>
  //     )}
  //   </div>
  // )

  useEffect(() => {
    if (!player.current) {
      return
    }

    player.current.seekTo(0)
  }, [curSongReq])

  // useEffect(() => {
  //   const reactionHandler: SnapshotReactionHandler = (id, type) => {
  //     emitAddReaction({ id, type })
  //   }

  //   const unsubReaction = playerRepo.onSnapshotReaction(reactionHandler)

  //   return () => {
  //     unsubReaction()
  //   }
  // }, [])

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
            <div className="w-[34rem] rounded-full border border-primary-light pl-4 pr-2 flex items-center">
              <input
                ref={searchInputRef}
                autoFocus
                value={keyword}
                placeholder="Search video by name or Youtube URL"
                className="px-2 py-2 w-full outline-none bg-transparent flex-1"
                onChange={({ target: { value } }) => handleChangeKeyword(value)}
              />
              {keyword.length > 0 && (
                <IconButton onClick={handleClearKeyword}>
                  <IoClose className="text-secondary/50 hover:text-secondary" />
                </IconButton>
              )}
            </div>
          </div>
          <header className="fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary z-40">
            <Header page="search" />
          </header>
          <div className="fixed top-16 right-6 overflow-hidden lg:rounded-xl lg:h-[calc(100vh-5.5rem)] lg:w-[26rem]">
            <PlaylistBox
              onSongReqChange={setCurSongReq}
              // miniPlayer={miniPlayer}
            />
          </div>
          {/* <ReactionPool elementRef={playerRef} /> */}
          <div className="pl-6 pr-[32rem] overflow-auto">
            <div className="lg:h-20" />
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
