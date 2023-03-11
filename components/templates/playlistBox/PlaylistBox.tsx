/* eslint-disable @next/next/no-img-element */
import { useRef, useEffect, useState, FC, useCallback } from 'react'

import { newYoutubeSong } from '../../../models/song/YoutubeSong'
import PlaylistRepository from '../../../services/firestore/PlaylistRepository'
import Playlist, { newPlaylist } from '../../../models/songRequest/Playlist'
import MusicController, {
  MusicControllerOptions,
} from '../../organisms/MusicController'
import SongCard from '../../organisms/SongCard'
import PlayerStateRepository from '../../../services/firestore/PlayerStateRepository'
import {
  newPlayerState,
  PlayerState,
  updatePlayerState,
} from '../../../models/playerState/playerState'
import SongRequest, {
  newSongRequest,
} from '../../../models/songRequest/SongRequest'
import { getAnonymousUser } from '../../../models/user/User'
import { playerEvent } from '../../../models/eventEmitter/player'

const playlistRepo = new PlaylistRepository('isling')
const playlistStateRepo = new PlayerStateRepository('isling')

const defaultSong = newYoutubeSong(
  'IOe0tNoUGv8',
  'EM ĐỒNG Ý (I DO) - ĐỨC PHÚC x 911 x KHẮC HƯNG',
  'https://i.ytimg.com/vi/IOe0tNoUGv8/hqdefault.jpg',
  222
)

const defaultSongReq = newSongRequest(
  defaultSong,
  getAnonymousUser(),
  '0000000000'
)

export interface PlaylistBoxProps {
  onSongReqChange?: (songReq: SongRequest) => void
  musicControllerOptions?: MusicControllerOptions
}

const PlaylistBox: FC<PlaylistBoxProps> = ({
  onSongReqChange,
  musicControllerOptions,
}) => {
  const [playlist, setPlaylist] = useState<Playlist>(newPlaylist([], 0))
  const [playerState, setPlayerState] = useState<PlayerState>(
    newPlayerState(defaultSongReq, 0)
  )
  const [isSync, setIsSync] = useState(true)
  const [curSongReq, setCurSongReq] = useState<SongRequest>(defaultSongReq)
  const songReqIndex = useRef(0)
  const songReqTotal = useRef(0)
  const syncFirstTimeDone = useRef(false)
  const shadowPlayerState = useRef(playerState)
  const shadowIsSync = useRef(isSync)
  const isMouseEnterPlaylist = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)

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
      playlistStateRepo.updatePlayerState({ endOfList: true })

      return
    }

    songReqIndex.current += 1
    setCurSongReq(playlist.list[songReqIndex.current])
  }, [playlist.list])

  const playBySongReqId = (songReqId: string) => {
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
    await playlistStateRepo.removeController()
    setPlaylist(newPlaylist([], 0))
    alert('Clear playlist successfully')
  }

  const shufflePlaylist = async () => {
    const list = [...playlist.list]
    const shuffleList = list.sort(() => Math.random() - 0.5)

    const theNewPlaylist = newPlaylist(shuffleList, playlist.version)
    await playlistRepo.setPlaylist(theNewPlaylist)
    songReqIndex.current = 0
    setCurSongReq(shuffleList[songReqIndex.current])
  }

  const handleMouseEnter = () => {
    console.log('### mouse enter playlist')
    isMouseEnterPlaylist.current = true
  }

  const handleMouseLeave = () => {
    console.log('### mouse out')
    isMouseEnterPlaylist.current = false
  }

  useEffect(() => {
    if (playlist.list.length === 0) {
      setCurSongReq(defaultSongReq)
      songReqIndex.current = 0
      return
    }

    if (playerState.endOfList && playlist.list.length > songReqTotal.current) {
      songReqIndex.current = songReqTotal.current
    } else {
      const curSongReqIdx = playlist.list.findIndex(
        (songReq) => songReq.id === playerState.requestId
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
      if (val.id === playlist.list[songReqIndex.current].id) {
        return val
      }

      return playlist.list[songReqIndex.current]
    })
  }, [playerState.endOfList, playerState.requestId, playlist])

  useEffect(() => {
    if (onSongReqChange) {
      onSongReqChange(curSongReq)
    }
  }, [curSongReq, onSongReqChange])

  useEffect(() => {
    shadowPlayerState.current = playerState
  }, [playerState])

  // change curSongReq -> change playerState
  useEffect(() => {
    if (shadowPlayerState.current.requestId === curSongReq.id) {
      return
    }

    const theNewState = updatePlayerState(shadowPlayerState.current, curSongReq)

    console.log('player: change player state:', theNewState)

    if (shadowIsSync.current && syncFirstTimeDone.current) {
      playlistStateRepo.setPlayerState(theNewState)
    } else {
      setPlayerState(theNewState)
    }
  }, [curSongReq])

  useEffect(() => {
    // prevent auto scroll when user are reacting with playlist
    if (isMouseEnterPlaylist.current) {
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
          topBarPlaceholderHeight -
          8 -
          scrollRef.current.clientHeight / 2 +
          2 * songCardRef.clientHeight,
        0
      ),
      behavior: 'smooth',
    })
  }, [curSongReq])

  useEffect(() => {
    const unsubPlaylist = playlistRepo.onSnapshotPlaylist((playlist) => {
      console.log('player: playlist changed:', playlist)
      if (!playlist) return

      setPlaylist(playlist)
    })

    return () => {
      unsubPlaylist()
    }
  }, [])

  useEffect(() => {
    if (!isSync) {
      return
    }

    const unsubController = playlistStateRepo.onSnapshotController((state) => {
      console.log('player: player state changed:', state)

      if (state !== undefined) {
        setPlayerState(state)
      }

      syncFirstTimeDone.current = true
    })

    return () => {
      unsubController()
    }
  }, [isSync])

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
        <img
          src={curSongReq.song.thumbnail}
          alt=""
          className="object-cover h-full w-full opacity-90 scale-150"
        />
      </div>
      <div className="relative w-full h-full z-20 pl-2 lg:pl-4 backdrop-blur-xl">
        <div
          ref={scrollRef}
          className="overflow-y-auto space-y-2 lg:space-y-3 h-full"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="h-1" id="top-bar-placeholder" />
          {playlist.list.map((songReq) => (
            <div className="pr-2 lg:pr-4" key={songReq.id}>
              <SongCard
                songRequest={songReq}
                isCurSong={curSongReq.id === songReq.id}
                play={() => playBySongReqId(songReq.id)}
                remove={() => removeSongRequest(songReq.id)}
              />
            </div>
          ))}
          <div className="h-[80px] lg:h-[92px]" />
        </div>
      </div>
      <div className="fixed lg:absolute bottom-0 w-full z-40 backdrop-blur-md">
        <div className="relative p-2 lg:p-4">
          <MusicController
            next={next}
            previous={previous}
            shuffle={shufflePlaylist}
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
