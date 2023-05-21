'use client'
import { useRef, useEffect, useState, FC, useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { newSong } from '@/models/song/Song'
import PlaylistRepository from '@/services/firestore/PlaylistRepository'
import Playlist, { newPlaylist } from '@/models/songRequest/Playlist'
import PlayerStateRepository from '@/services/firestore/PlayerStateRepository'
import {
  newPlayerState,
  PlayerState,
  updatePlayerState,
} from '@/models/playerState/playerState'
import SongRequest, { newSongRequest } from '@/models/songRequest/SongRequest'
import { getAnonymousUser } from '@/models/user/User'
import { playerEvent } from '@/models/eventEmitter/player'
import { playlistStore } from '@/stores/playlist'
import { curSongReqStore, isPlayingStore } from '@/stores/player'

import MusicController, {
  MusicControllerOptions,
} from '../../organisms/MusicController'
import SongCard from '../../organisms/SongCard'
import { useToast } from '@/components/atoms/use-toast'

const defaultSong = newSong(
  'IOe0tNoUGv8',
  'EM ĐỒNG Ý (I DO) - ĐỨC PHÚC x 911 x KHẮC HƯNG',
  'EM ĐỒNG Ý',
  'https://i.ytimg.com/vi/IOe0tNoUGv8/hqdefault.jpg',
  '4:30',
  'ĐỨC PHÚC'
)

const defaultSongReq = newSongRequest(
  defaultSong,
  getAnonymousUser(),
  '0000000000'
)

export interface PlaylistBoxProps {
  onSongReqChange?: (songReq: SongRequest) => void
  musicControllerOptions?: MusicControllerOptions
  hasMiniPlayer?: boolean
}

const PlaylistBox: FC<PlaylistBoxProps> = ({
  onSongReqChange,
  musicControllerOptions,
  hasMiniPlayer = false,
}) => {
  const [playlist, setPlaylist] = useRecoilState<Playlist>(playlistStore)
  const [playerState, setPlayerState] = useState<PlayerState>()
  const setIsPlaying = useSetRecoilState(isPlayingStore)
  const [isSync, setIsSync] = useState(true)
  const [curSongReq, setCurSongReq] = useRecoilState(curSongReqStore)
  const songReqIndex = useRef(0)
  const songReqTotal = useRef(playlist.list.length)
  const syncFirstTimeDone = useRef(false)
  const loadPlaylistFirstTimeDone = useRef(false)
  const shadowPlayerState = useRef(playerState)
  const shadowIsSync = useRef(isSync)
  const isMouseEnterPlaylist = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const params = useParams()
  const { toast } = useToast()

  const roomId = (params?.id as string) || 'isling'

  const playlistRepo = useMemo(() => new PlaylistRepository(roomId), [roomId])
  const playerRepo = useMemo(() => new PlayerStateRepository(roomId), [roomId])

  const next = () => {
    if (songReqIndex.current >= playlist.list.length - 1) {
      return
    }

    songReqIndex.current += 1
    setCurSongReq(playlist.list[songReqIndex.current])
  }

  const previous = () => {
    songReqIndex.current = Math.max(0, songReqIndex.current - 1)

    if (!playlist.list[songReqIndex.current]) {
      return
    }

    setCurSongReq(playlist.list[songReqIndex.current])
  }

  const handleVideoEndOrError = useCallback(() => {
    if (songReqIndex.current >= playlist.list.length - 1) {
      playerRepo.updatePlayerState({ endOfList: true })

      return
    }

    songReqIndex.current += 1
    setCurSongReq(playlist.list[songReqIndex.current])
  }, [playerRepo, playlist.list, setCurSongReq])

  const playBySongReqId = (songReqId: string) => {
    setIsPlaying(true)

    const idx = playlist.list.findIndex((songReq) => songReq.id === songReqId)

    songReqIndex.current = Math.max(0, idx)
    setCurSongReq(playlist.list[songReqIndex.current])
  }

  const handleSetIsSync = (enable: boolean) => {
    if (!enable) {
      syncFirstTimeDone.current = false
    }

    shadowIsSync.current = enable
    setIsSync(enable)
  }

  const removeSongRequest = async (rmSongReqId: string) => {
    const newList = [...playlist.list].filter(
      (songReq) => songReq.id !== rmSongReqId
    )
    const theNewPlaylist = newPlaylist(newList, playlist.version)

    await playlistRepo.setPlaylist(theNewPlaylist)
  }

  const clearPlaylist = async () => {
    await playlistRepo.removePlaylist()
    await playerRepo.removeController()
    setPlaylist(newPlaylist([], 0))
    toast({
      description: 'Clear this playlist successfully',
    })
  }

  const handleMouseEnter = () => {
    isMouseEnterPlaylist.current = true
  }

  const handleMouseLeave = () => {
    isMouseEnterPlaylist.current = false
  }

  useEffect(() => {
    // do nothing if both playlist and playerState have not loaded
    if (!loadPlaylistFirstTimeDone.current || !syncFirstTimeDone.current) {
      return
    }

    if (playlist.list.length === 0) {
      setCurSongReq(defaultSongReq)
      songReqIndex.current = 0
      return
    }

    if (playerState?.endOfList && playlist.list.length > songReqTotal.current) {
      songReqIndex.current = songReqTotal.current
    } else {
      const curSongReqIdx = playlist.list.findIndex(
        (songReq) => songReq.id === playerState?.requestId
      )

      if (curSongReqIdx >= 0) {
        songReqIndex.current = curSongReqIdx
      } else {
        songReqIndex.current = Math.min(
          songReqIndex.current,
          playlist.list.length - 1
        )
      }
    }

    songReqTotal.current = playlist.list.length

    setCurSongReq((val) => {
      if (val?.id === playlist.list[songReqIndex.current].id) {
        return val
      }

      return playlist.list[songReqIndex.current]
    })
  }, [playerState?.endOfList, playerState?.requestId, playlist, setCurSongReq])

  useEffect(() => {
    if (onSongReqChange && curSongReq) {
      onSongReqChange(curSongReq)
    }
  }, [curSongReq, onSongReqChange])

  useEffect(() => {
    shadowPlayerState.current = playerState
  }, [playerState])

  // change curSongReq -> change playerState
  useEffect(() => {
    if (
      !curSongReq ||
      !shadowPlayerState.current ||
      shadowPlayerState.current.requestId === curSongReq.id
    ) {
      return
    }

    const theNewState = updatePlayerState(shadowPlayerState.current, curSongReq)

    console.log('player: change player state:', theNewState)

    if (shadowIsSync.current && syncFirstTimeDone.current) {
      playerRepo.setPlayerState(theNewState)
    } else {
      setPlayerState(theNewState)
    }
  }, [curSongReq, playerRepo])

  useEffect(() => {
    // prevent auto scroll when user are reacting with playlist
    if (isMouseEnterPlaylist.current || !curSongReq) {
      return
    }

    const songCardRef = document.getElementById(curSongReq.id)
    const topBarPlaceholder = document.getElementById('top-bar-placeholder')
    const topBarPlaceholderHeight = topBarPlaceholder?.clientHeight || 0

    if (!songCardRef || !scrollRef.current) {
      return
    }

    scrollRef.current.scrollTo({
      top: Math.max(
        songCardRef.offsetTop -
          scrollRef.current.offsetTop -
          topBarPlaceholderHeight -
          8 -
          scrollRef.current.clientHeight / 2 +
          1.5 * songCardRef.clientHeight,
        0
      ),
      behavior: 'smooth',
    })
  }, [curSongReq])

  useEffect(() => {
    const unsubPlaylist = playlistRepo.onSnapshotPlaylist((playlist) => {
      loadPlaylistFirstTimeDone.current = true

      console.log('player: playlist changed:', playlist)
      if (!playlist) {
        setPlaylist(newPlaylist([], 0))

        return
      }

      setPlaylist(playlist)
    })

    return () => {
      unsubPlaylist()
    }
  }, [playlistRepo, setPlaylist])

  useEffect(() => {
    if (!isSync) {
      return
    }

    const unsubController = playerRepo.onSnapshotController((state) => {
      console.log('player: player state changed:', state)
      syncFirstTimeDone.current = true

      if (!state) {
        setPlayerState(newPlayerState(defaultSongReq, 0))

        return
      }

      setPlayerState(state)
    })

    return () => {
      unsubController()
    }
  }, [isSync, playerRepo])

  useEffect(() => {
    playerEvent.on('ended', handleVideoEndOrError)
    playerEvent.on('error', handleVideoEndOrError)

    return () => {
      playerEvent.removeListener('ended', handleVideoEndOrError)
      playerEvent.removeListener('error', handleVideoEndOrError)
    }
  }, [handleVideoEndOrError])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        isMouseEnterPlaylist.current = false
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute w-full h-full blur-3xl z-10 bg-primary">
        {curSongReq && (
          <Image
            src={curSongReq.song.thumbnail}
            alt={curSongReq.song.title}
            className="object-cover h-full w-full opacity-90 scale-150"
            fill
            unoptimized
          />
        )}
      </div>
      <div className="relative grid grid-rows-[auto_1fr] w-full h-full z-20 backdrop-blur-xl">
        <div
          id={hasMiniPlayer ? 'video-placeholder' : ''}
          className={`
              ${hasMiniPlayer ? 'w-full aspect-video rounded-t-xl' : 'w-0'}
          `}
        />
        <div
          ref={scrollRef}
          className="overflow-y-auto space-y-2 lg:space-y-3"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="h-1" id="top-bar-placeholder" />
          {playlist.list.map((songReq) => (
            <div className="px-2 lg:px-4" key={songReq.id}>
              <SongCard
                songRequest={songReq}
                isCurSong={curSongReq?.id === songReq.id}
                play={() => playBySongReqId(songReq.id)}
                remove={() => removeSongRequest(songReq.id)}
              />
            </div>
          ))}
          <div className="h-[80px] lg:h-[80px]" />
        </div>
      </div>
      <div className="fixed lg:absolute bottom-0 w-full z-30 backdrop-blur-md">
        <div className="relative p-2 lg:p-4">
          <MusicController
            next={next}
            previous={previous}
            setIsSync={handleSetIsSync}
            clearPlaylist={clearPlaylist}
            options={musicControllerOptions}
          />
        </div>
      </div>
    </div>
  )
}

export default PlaylistBox
