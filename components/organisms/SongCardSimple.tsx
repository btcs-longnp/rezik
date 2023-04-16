import { FC, useEffect, useRef, useState } from 'react'
import { IoAdd, IoCheckmarkCircle } from 'react-icons/io5'
import Image from 'next/image'

import Song from '../../models/song/Song'
import { truncateWithEllipsis } from '../../services/utils/string'

export interface SongCardProps {
  song: Song
}

const SongCardSimple: FC<SongCardProps> = ({ song }) => {
  const [songTitle, setSongTitle] = useState(song.title)
  const songCardRef = useRef<HTMLDivElement>(null)
  const songTitleRef = useRef<HTMLDivElement>(null)
  const [isShowResponse, setIsShowResponse] = useState(false)

  const handleClick = () => {
    setIsShowResponse(true)

    setTimeout(() => {
      setIsShowResponse(false)
    }, 1000)
  }

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
      ref={songCardRef}
      className="grid grid-cols-[auto_1fr] rounded-xl overflow-hidden text-secondary group"
      onClick={handleClick}
    >
      <div className="w-80 aspect-[16/10] relative overflow-hidden rounded-xl">
        <div className="absolute bottom-2 right-2 px-1 py-0.5 z-10 bg-black/60 rounded text-xs font-semibold">
          {song.duration}
        </div>
        <div className="absolute bg-green-700/20 w-full h-full z-20 grid place-items-center transition-all duration-75 invisible group-hover:visible">
          {isShowResponse ? (
            <IoCheckmarkCircle className="text-5xl text-green-700/60" />
          ) : (
            <IoAdd className="text-5xl" />
          )}
        </div>
        <Image
          src={song.thumbnail}
          alt={song.title}
          className="object-cover w-full h-full scale-[1.1] group-active:scale-125 transition-all duration-500"
          fill
          sizes="480px"
        />
      </div>
      <div className="pl-4 h-full relative">
        <div ref={songTitleRef} className="font-light text-lg">
          {truncateWithEllipsis(songTitle, 150)}
        </div>
        <div className="font-light text-sm text-secondary/50 mt-3">
          {truncateWithEllipsis(song.channelTitle, 50)}
        </div>
        <div className="font-light text-xs text-secondary/50 mt-3">
          {truncateWithEllipsis(song.description, 90)}
        </div>
      </div>
    </div>
  )
}

export default SongCardSimple
