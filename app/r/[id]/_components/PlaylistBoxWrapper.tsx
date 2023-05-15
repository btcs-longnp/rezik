'use client'
import PlaylistBox, {
  PlaylistBoxProps,
} from '@/components/templates/playlistBox/PlaylistBox'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

const PlayListBoxWrapper: FC<PlaylistBoxProps & { roomId: string }> = (
  props
) => {
  const pathName = usePathname()
  const isLivingRoom = pathName === `/r/${props.roomId}`

  return <PlaylistBox {...props} hasMiniPlayer={!isLivingRoom} />
}

export default PlayListBoxWrapper
