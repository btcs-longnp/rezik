'use client'
import RoomHeader, {
  RoomHeaderProps,
} from '@/components/templates/headers/RoomHeader'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

const RoomHeaderWrapper: FC<RoomHeaderProps> = (props) => {
  const { room } = props
  const pathName = usePathname()
  const isLivingRoom = pathName === `/r/${room?.id}`
  const backBtnConfig =
    !room || isLivingRoom
      ? { url: '/', title: 'Home' }
      : { url: `/r/${room.id}`, title: room.name }

  return <RoomHeader {...props} backBtn={backBtnConfig} />
}

export default RoomHeaderWrapper
