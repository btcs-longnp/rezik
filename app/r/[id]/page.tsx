'use client'
import { useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useRecoilValue } from 'recoil'
import { searchQueryStore } from '@/stores/search'
import ReactionIcon from '@com/atoms/ReactionIcon'
import { ReactionType } from '@/models/Reaction'
import PlayerStateRepository from '@/services/firestore/PlayerStateRepository'
import { curSongReqStore } from '@/stores/player'

const listReaction: ReactionType[] = [
  'haha',
  'heart',
  'sad',
  'surprise',
  'angry',
]

const Page = ({ params }: { params: Record<string, string> }) => {
  const searchQuery = useRecoilValue(searchQueryStore)
  const curSongReq = useRecoilValue(curSongReqStore)
  const router = useRouter()
  const pathName = usePathname()

  const roomId = (params.id as string) || 'isling'

  const playerRepo = useMemo(() => new PlayerStateRepository(roomId), [roomId])

  const handleReaction = (type: ReactionType) => () => {
    playerRepo.reaction(type)
  }

  useEffect(() => {
    if (searchQuery !== '') {
      router.push(`${pathName}/search`)
    }
  }, [searchQuery, router, pathName])

  return (
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
  )
}

export default Page
