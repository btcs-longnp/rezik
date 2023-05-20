'use client'
import RoomHeader, {
  RoomHeaderProps,
} from '@/components/templates/headers/RoomHeader'
import RoomHeaderForGuest from '@/components/templates/headers/RoomHeaderForGuest'
import { isAnonymousUser } from '@/models/user/User'
import { useAuth } from '@/services/simpleAuth/useAuth'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

const RoomHeaderWrapper: FC<Omit<RoomHeaderProps, 'currentUser'>> = (props) => {
  const { currentUser } = useAuth()

  const { room } = props
  const pathName = usePathname()
  const isLivingRoom = pathName === `/r/${room?.id}`
  const backBtnConfig =
    !room || isLivingRoom
      ? { url: '/', title: 'Home' }
      : { url: `/r/${room.id}`, title: room.name }

  return isAnonymousUser(currentUser) ? (
    <RoomHeaderForGuest {...props} backBtn={backBtnConfig} />
  ) : (
    <RoomHeader {...props} backBtn={backBtnConfig} currentUser={currentUser} />
  )
}

export default RoomHeaderWrapper
