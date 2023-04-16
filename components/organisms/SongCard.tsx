import { FC, useEffect, useRef, useState } from 'react'
import { IoPlay, IoTrash } from 'react-icons/io5'
import Image from 'next/image'

import SongRequest from '../../models/songRequest/SongRequest'
import { truncateWithEllipsis } from '../../services/utils/string'
import IconButton from '../atoms/buttons/IconButton'

export interface SongCardProps {
  songRequest: SongRequest
  isCurSong: boolean
  play: () => void
  remove: () => void
}

const SongCard: FC<SongCardProps> = ({
  songRequest,
  isCurSong: isPlaying,
  play,
  remove,
}) => {
  const [songTitle, setSongTitle] = useState(songRequest.song.title)
  const songCardRef = useRef<HTMLDivElement>(null)
  const songTitleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!songCardRef.current || !songTitleRef.current) {
      return
    }

    const titleHeight = songTitleRef.current.clientHeight
    const cardHeight = songCardRef.current.clientHeight

    if (titleHeight > cardHeight / 2) {
      setSongTitle(truncateWithEllipsis(songTitle, songTitle.length - 5))
    }
  }, [songTitle])

  return (
    <div
      id={songRequest.id}
      ref={songCardRef}
      className={`grid grid-cols-[auto_1fr] group rounded-md overflow-hidden hover:bg-white/30 ${
        isPlaying ? 'bg-rose-400 bg-opacity-75' : ''
      }`}
    >
      <div className="w-28 h-20 relative overflow-hidden">
        <div className="absolute bottom-1 right-1 text-xs font-light bg-black/60 rounded-sm p-0.5 z-10">
          {songRequest.song.duration}
        </div>
        {isPlaying && (
          <div className="absolute w-full h-full grid place-items-center z-10">
            <IoPlay
              size={32}
              className="animate-pulse duration-1000 text-[#f8f8f2] text-opacity-80"
            />
          </div>
        )}
        <Image
          src={songRequest.song.thumbnail}
          alt={songRequest.song.title}
          className="object-cover w-full h-full scale-[1.4]"
          fill
          sizes="256px"
        />
      </div>
      <div className="pl-2 text-[#f8f8f2] h-full relative">
        <div
          ref={songTitleRef}
          className="font-light text-sm group-hover:hidden"
        >
          {songTitle}
        </div>
        <div className="hidden group-hover:block h-full">
          <div className="flex items-center space-x-2 h-full">
            <IconButton onClick={play}>
              <IoPlay />
            </IconButton>
            <IconButton onClick={remove}>
              <IoTrash />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SongCard
