/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useRef, useState } from 'react'
import { IoAdd, IoCheckmarkDone } from 'react-icons/io5'
import Song from '../../models/song/Song'

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
      setSongTitle(
        songTitle
          .slice(0, songTitle.length - 5)
          .trim()
          .replace(/[^A-Za-zÀ-ȕ0-9]$/gm, '')
          .concat('...')
      )
    }
  }, [songTitle])

  return (
    <div
      ref={songCardRef}
      className="grid grid-cols-[auto_1fr] rounded-xl overflow-hidden text-secondary group"
      onClick={handleClick}
    >
      <div className="w-80 aspect-[16/10] relative overflow-hidden rounded-xl">
        <div className="absolute bottom-2 right-2 px-1 py-0.5 z-10 bg-black rounded text-xs font-semibold">
          4:30
        </div>
        <div className="absolute bg-green-700/20 w-full h-full z-20 grid place-items-center transition-all duration-75 invisible group-hover:visible">
          {isShowResponse ? (
            <IoCheckmarkDone className="text-5xl" />
          ) : (
            <IoAdd className="text-5xl" />
          )}
        </div>
        <img
          src={song.thumbnail}
          alt={song.title}
          className="object-cover w-full h-full scale-[1.1]"
        />
      </div>
      <div className="pl-4 h-full relative">
        <div ref={songTitleRef} className="font-light text-lg">
          {songTitle}
        </div>
      </div>
    </div>
  )
}

export default SongCardSimple
