import { useEffect, useRef, useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import ReactPlayer from 'react-player'

import SongRequest from '../models/songRequest/SongRequest'
import PlaylistBox from '../components/templates/playlistBox/PlaylistBox'
import { playerEvent } from '../models/eventEmitter/player'
import { useRecoilState } from 'recoil'
import { isPlayingStore } from '../stores/player'
import Header from '../components/templates/Header'
import { IoPlay } from 'react-icons/io5'

const youtubeVideoBaseUrl = 'https://www.youtube.com/watch?v='

const Player: NextPage = () => {
  const player = useRef<ReactPlayer>(null)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingStore)
  const [curSongReq, setCurSongReq] = useState<SongRequest>()

  const onReady = () => {
    console.log('player: onReady')
    setIsPlaying(true)
  }

  const handleVideoEndOrError = () => {
    playerEvent.emit('ended')
  }

  const onPlay = () => {
    console.log('onPlay')
    setIsPlaying(true)
  }

  const onPause = () => {
    console.log('onPause')
    setIsPlaying(false)
  }

  useEffect(() => {
    if (!player.current) {
      return
    }

    player.current.seekTo(0)
  }, [curSongReq])

  return (
    <div>
      <Head>
        <title>isling - Watch Video Together</title>
        <meta name="description" content="Let's watch videos together" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="relative bg-primary">
          <header className="fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary z-40">
            <Header />
          </header>
          <div className="relative lg:static lg:grid lg:grid-cols-[1fr_auto] lg:px-6 lg:space-x-6 h-screen overflow-auto">
            <div className="fixed lg:static top-0 left-0 z-30 w-full">
              <div className="lg:h-16" />
              <div className="overflow-hidden lg:rounded-xl aspect-[3/2] lg:aspect-auto lg:h-[calc(100vh-5.5rem)]">
                {curSongReq ? (
                  <ReactPlayer
                    ref={player}
                    url={youtubeVideoBaseUrl + curSongReq.song.id}
                    playing={isPlaying}
                    controls={true}
                    onPlay={onPlay}
                    onPause={onPause}
                    onEnded={handleVideoEndOrError}
                    onError={handleVideoEndOrError}
                    onReady={onReady}
                    width="100%"
                    height="100%"
                  />
                ) : (
                  <div className="h-full grid grid-rows-[auto_1fr_auto]">
                    <div className="h-20 bg-black" />
                    <div className="h-full bg-gray-400 grid place-items-center">
                      <IoPlay className="text-9xl text-primary-light animate-pulse duration-300" />
                    </div>
                    <div className="h-20 bg-black" />
                  </div>
                )}
              </div>
            </div>
            <div className="lg:w-[26rem]">
              <div className="h-[calc(100vw*2/3)] lg:h-16" />
              <div className="overflow-hidden lg:rounded-xl lg:h-[calc(100vh-5.5rem)]">
                <PlaylistBox onSongReqChange={setCurSongReq} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Player
