import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'

import PlaylistBox from '../../../components/templates/playlistBox/PlaylistBox'
import RoomHeader from '../../../components/templates/headers/RoomHeader'
import { searchQueryStore } from '../../../stores/search'
import ReactionIcon from '../../../components/atoms/ReactionIcon'
import { ReactionType } from '../../../models/Reaction'
import PlayerStateRepository from '../../../services/firestore/PlayerStateRepository'
import { curSongReqStore } from '../../../stores/player'
import { Room } from '../../../models/room/Room'
import { getRoomById } from '../../../services/room/room'

const listReaction: ReactionType[] = [
  'haha',
  'heart',
  'sad',
  'surprise',
  'angry',
]

const Player: NextPage = () => {
  const searchQuery = useRecoilValue(searchQueryStore)
  const curSongReq = useRecoilValue(curSongReqStore)
  const router = useRouter()
  const [room, setRoom] = useState<Room>()

  const roomId = (router.query.id as string) || 'isling'

  const playerRepo = useMemo(() => new PlayerStateRepository(roomId), [roomId])

  const handleReaction = (type: ReactionType) => () => {
    playerRepo.reaction(type)
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
    if (searchQuery !== '') {
      router.push(`/r/${roomId}/search`)
    }
  }, [searchQuery, router, roomId])

  return (
    <div>
      <Head>
        <title>{`${room ? room.name : ''} — isling`}</title>
        <meta name="description" content="Let's watch videos together" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="relative bg-primary">
          <header className="fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary z-40">
            <RoomHeader room={room} />
          </header>
          <div className="fixed top-[4.5rem] right-6 overflow-hidden lg:rounded-xl lg:h-[calc(100vh-6rem)] lg:w-[26rem]">
            <PlaylistBox />
          </div>
          <div className="pl-6 pr-[29rem]">
            <div className="lg:h-[4.5rem]" />
            <div
              id="video-placeholder"
              className="overflow-hidden lg:rounded-sm aspect-[3/2] lg:aspect-video lg:w-full"
            />
            <div className="text-xl text-secondary mt-3">
              {curSongReq?.song.title}
            </div>
            <div className="grid grid-cols-[1fr_auto] text-secondary h-16 mb-6">
              <div className="mt-6 flex space-x-4" />
              <div className="flex space-x-4 items-center">
                {listReaction.map((type) => (
                  <div
                    key={type}
                    onClick={handleReaction(type as ReactionType)}
                    className="w-12 h-12 cursor-pointer hover:w-16 hover:h-16 transition-all duration-700 group"
                  >
                    <ReactionIcon
                      type={type as ReactionType}
                      className="group-active:scale-110 transition-all duration-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Player
