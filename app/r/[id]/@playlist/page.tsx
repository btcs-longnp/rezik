'use client'
import PlaylistBox from '@/components/templates/playlistBox/PlaylistBox'
import { usePathname } from 'next/navigation'

export default function Page({ params }: { params: Record<string, string> }) {
  const pathName = usePathname()
  const isLivingRoom = pathName === `/r/${params.id}`

  return <PlaylistBox hasMiniPlayer={!isLivingRoom} />
}
