import { FC, useEffect, useState } from 'react'
import {
  IoPause,
  IoPlay,
  IoPlayBack,
  IoPlayForward,
  IoSync,
  IoTrashBin,
} from 'react-icons/io5'
import { useRecoilState } from 'recoil'
import { isPlayingStore } from '../../stores/player'
import IconButton from '../atoms/IconButton'

export interface MusicControllerOptions {
  restrictPlayBtn?: boolean
  restrictOffSync?: boolean
}

interface MusicControllerProps {
  next: () => void
  previous: () => void
  setIsSync: (isSync: boolean) => void
  clearPlaylist: () => void
  options?: MusicControllerOptions
}

const MusicController: FC<MusicControllerProps> = (props) => {
  const [isSync, setIsSync] = useState(true)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingStore)

  const handleToggleSync = () => {
    setIsSync(!isSync)
  }

  const handleTogglePlay = () => {
    setIsPlaying((val) => !val)
  }

  useEffect(() => {
    props.setIsSync(isSync)
  }, [isSync, props])

  return (
    <div className="flex justify-around items-center rounded-full px-3 py-2 bg-opacity-80 bg-primary-light hover:bg-opacity-95 transition-all duration-300">
      <IconButton onClick={props.previous}>
        <IoPlayBack />
      </IconButton>
      {!props.options?.restrictPlayBtn && (
        <IconButton onClick={handleTogglePlay}>
          {isPlaying ? <IoPause /> : <IoPlay />}
        </IconButton>
      )}
      <IconButton onClick={props.next}>
        <IoPlayForward />
      </IconButton>
      {!props.options?.restrictPlayBtn && (
        <IconButton onClick={handleToggleSync}>
          <IoSync className={isSync ? `text-sky-300` : ''} />
        </IconButton>
      )}
      <IconButton onClick={props.clearPlaylist}>
        <IoTrashBin className="text-rose-400" />
      </IconButton>
    </div>
  )
}

export default MusicController
