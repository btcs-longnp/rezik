import type { NextPage, NextPageContext } from 'next'
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'

import PlaylistBox from '../../../components/templates/playlistBox/PlaylistBox'
import RoomHeader from '../../../components/templates/headers/RoomHeader'
import { searchQueryStore } from '../../../stores/search'
import ReactionIcon from '../../../components/atoms/ReactionIcon'
import { ReactionType } from '../../../models/Reaction'
import PlayerStateRepository from '../../../services/firestore/PlayerStateRepository'
import { curSongReqStore } from '../../../stores/player'
import { RoomPublic } from '../../../models/room/Room'
import { getRoomById } from '../../../services/room/room'
import { toRoomPublic } from '../../../models/room/transform'
import RoomHead from '../../../components/atoms/head/RoomHead'

const listReaction: ReactionType[] = [
  'haha',
  'heart',
  'sad',
  'surprise',
  'angry',
]

interface PlayerProps {
  roomPublic: RoomPublic
}

const Player: NextPage<PlayerProps> = ({ roomPublic }) => {
  const searchQuery = useRecoilValue(searchQueryStore)
  const curSongReq = useRecoilValue(curSongReqStore)
  const router = useRouter()

  const roomId = (router.query.id as string) || 'isling'

  const playerRepo = useMemo(() => new PlayerStateRepository(roomId), [roomId])

  const handleReaction = (type: ReactionType) => () => {
    playerRepo.reaction(type)
  }

  useEffect(() => {
    if (searchQuery !== '') {
      router.push(`/r/${roomId}/search`)
    }
  }, [searchQuery, router, roomId])

  return (
    <div>
      <RoomHead roomPublic={roomPublic} path={`/r/${roomPublic.id}`} />
      <main>
        <div className="relative bg-primary">
          <header className="fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary z-40">
            <RoomHeader room={roomPublic} />
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

export async function getServerSideProps(context: NextPageContext) {
  const room = getRoomById(context.query.id as string)

  if (!room) {
    return {
      redirect: {
        permanent: false,
        destination: `/r/${context.query.id}/404`,
      },
    }
  }

  const roomPublic = toRoomPublic(room)

  return {
    props: {
      roomPublic,
    },
  }
}
