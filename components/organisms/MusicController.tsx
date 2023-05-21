import { FC, useEffect, useState } from 'react'
import { IoSync, IoTrashBin } from 'react-icons/io5'
import { useRecoilState } from 'recoil'
import { isPlayingStore } from '@/stores/player'

import IconButton from '../atoms/buttons/IconButton'
import { Tooltip } from '../atoms/tooltip'
import { AlertTriangle, Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../atoms/popover'
import { Alert, AlertDescription, AlertTitle } from '../atoms/alert'
import { Button } from '../atoms/button'

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
  const [isOpenClearPlaylistPopover, setIsOpenClearPlaylistPopover] =
    useState(false)

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
        <SkipBack size={16} />
      </IconButton>
      {!props.options?.restrictPlayBtn && (
        <IconButton onClick={handleTogglePlay}>
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </IconButton>
      )}
      <IconButton onClick={props.next}>
        <SkipForward size={16} />
      </IconButton>
      {!props.options?.restrictPlayBtn && (
        <Tooltip content="Sync mode">
          <IconButton onClick={handleToggleSync}>
            <IoSync className={isSync ? `text-sky-300` : ''} />
          </IconButton>
        </Tooltip>
      )}
      <Popover
        open={isOpenClearPlaylistPopover}
        onOpenChange={setIsOpenClearPlaylistPopover}
      >
        <PopoverTrigger>
          <IconButton>
            <IoTrashBin className="text-rose-400" />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Alert variant="default" className="border-0">
            <AlertTriangle className="w-4 h-4" />
            <AlertTitle>Caution</AlertTitle>
            <AlertDescription>
              Do you want to clear this playlist?
            </AlertDescription>
            <div className="flex space-x-2">
              <Button
                variant="destructive"
                size="sm"
                className="px-4 mt-2"
                onClick={() => {
                  setIsOpenClearPlaylistPopover(false)
                  props.clearPlaylist()
                }}
              >
                Yes
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="px-4 mt-2"
                onClick={() => {
                  setIsOpenClearPlaylistPopover(false)
                }}
              >
                No
              </Button>
            </div>
          </Alert>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default MusicController
