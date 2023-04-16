import type { NextPage } from 'next'
import HomeLayout from '../components/templates/layouts/HomeLayout'
import Link from 'next/link'
import { IoPersonOutline } from 'react-icons/io5'
import { useRecoilValue } from 'recoil'
import { useEffect, useState } from 'react'
import Image from 'next/image'

import { currentUserStore } from '../stores/currentUser'
import { isAnonymousUser } from '../models/user/User'
import { getAvatarString } from '../services/utils/user'
import Roll from '../components/organisms/Roll'
import { Room } from '../models/room/Room'
import { getForYouRooms } from '../services/room/room'

const Home: NextPage = () => {
  const currentUser = useRecoilValue(currentUserStore)
  const [forYouRooms, setForYouRooms] = useState<Room[]>([])

  useEffect(() => {
    const rooms = getForYouRooms()
    setForYouRooms(rooms)
  }, [])

  return (
    <HomeLayout>
      <div className="mx-32">
        <Roll
          title={
            <div className="flex pb-2">
              <div className="flex items-center justify-center w-16 h-16 font-light rounded-full bg-primary-light">
                {isAnonymousUser(currentUser) ? (
                  <IoPersonOutline className="text-2xl" />
                ) : (
                  <div className="text-2xl">{getAvatarString(currentUser)}</div>
                )}
              </div>
              <div className="ml-4 h-full flex flex-col justify-between">
                <div className="text-secondary/60 leading-none font-light">
                  {currentUser.name.toUpperCase()}
                </div>
                <div className="text-3xl font-semibold">For you</div>
              </div>
            </div>
          }
        >
          {forYouRooms.map((room) => (
            <div
              className="w-80 active:scale-95 transition-all duration-100"
              key={room.id}
            >
              <Link href={`/r/${room.id}`}>
                <div className="relative aspect-video rounded w-80 overflow-hidden hover:brightness-75">
                  <Image
                    src={room.coverUrl}
                    alt={room.name}
                    className="object-cover"
                    fill
                    sizes="480px"
                  />
                </div>
              </Link>
              <div className="mt-4">
                <Link href={`/r/${room.id}`}>{room.name}</Link>
              </div>
              {room.description && (
                <div className="text-secondary/40 font-light mt-2">
                  {room.description}
                </div>
              )}
            </div>
          ))}
        </Roll>
      </div>
    </HomeLayout>
  )
}

export default Home
