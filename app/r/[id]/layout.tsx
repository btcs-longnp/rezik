import type { Metadata } from 'next'
import { getRoomById } from '@/services/room/room'
import { toRoomPublic } from '@/models/room/transform'
import { PropsWithChildren } from 'react'
import { notFound } from 'next/navigation'
import RoomHeaderWrapper from './_components/RoomHeaderWrapper'
import PlayListBoxWrapper from './_components/PlaylistBoxWrapper'

const websiteURL = process.env.NEXT_PUBLIC_WEBSITE_URL

export async function generateMetadata({
  params,
}: {
  params: Record<string, string>
}): Promise<Metadata> {
  const room = getRoomById(params.id)

  if (!room) {
    return {}
  }

  const roomPublic = toRoomPublic(room)
  const roomURL = `${websiteURL}${`/r/${roomPublic.id}`}`
  const roomTitle = `${roomPublic.name} — isling`

  return {
    title: roomTitle,
    description: roomPublic.description,
    icons: '/favicon.ico',
    openGraph: {
      siteName: 'Isling',
      url: roomURL,
      type: 'music.playlist',
      title: roomTitle,
      description: roomPublic.description,
      images: [
        {
          url: roomPublic.coverUrl,
        },
      ],
    },
    robots: 'index, follow',
  }
}

export default function RoomLayout(
  props: PropsWithChildren<{ params: Record<string, string> }>
) {
  const { children, params } = props
  const room = getRoomById(params.id)
  if (!room) {
    notFound()
  }

  return (
    <div>
      <div className="relative bg-primary">
        <header className="fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary z-40">
          <RoomHeaderWrapper room={room} isShowRoom />
        </header>
        <div className="fixed top-[4.5rem] right-6 overflow-hidden lg:rounded-xl lg:h-[calc(100vh-6rem)] lg:w-[26rem]">
          <PlayListBoxWrapper roomId={room.id} />
        </div>
        {children}
      </div>
    </div>
  )
}
