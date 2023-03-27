/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useRef, useState } from 'react'
import { IoPlay, IoTrash } from 'react-icons/io5'
import SongRequest from '../../models/songRequest/SongRequest'
import IconButton from '../atoms/IconButton'

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
      setSongTitle(
        songTitle
          .slice(0, songTitle.length - 5)
          .trim()
          // TODO: update regex replace non unicode character
          .replace(/[^A-Za-zÀ-ȕ0-9]$/gm, '')
          .concat('...')
      )
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
        {isPlaying && (
          <div className="absolute w-full h-full grid place-items-center z-10">
            <IoPlay
              size={32}
              className="animate-pulse duration-1000 text-[#f8f8f2] text-opacity-80"
            />
          </div>
        )}
        <img
          src={songRequest.song.thumbnail}
          alt=""
          className="object-cover w-full h-full scale-[1.4]"
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
