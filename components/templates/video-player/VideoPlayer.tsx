'use client'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import ReactPlayer from 'react-player'
import { useSpring, animated } from '@react-spring/web'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { playerEvent } from '@/models/eventEmitter/player'
import { curSongReqStore, isPlayingStore } from '@/stores/player'
import {
  emitAddReaction,
  emitClearReaction,
} from '@/services/emitter/reactionEmitter'
import PlayerStateRepository, {
  SnapshotReactionHandler,
} from '@/services/firestore/PlayerStateRepository'
import { playlistStore } from '@/stores/playlist'
import ReactionPool from '@com/templates/ReactionPool'

const youtubeVideoBaseUrl = 'https://www.youtube.com/watch?v='
const initialPos = {
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  opacity: 0,
  zIndex: 0,
}

function VideoPlayer() {
  const pathName = usePathname()
  const params = useParams()
  const searchParam = useSearchParams()
  const player = useRef<ReactPlayer>(null)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingStore)
  const curSongReq = useRecoilValue(curSongReqStore)
  const resetCurSongReq = useResetRecoilState(curSongReqStore)
  const resetPlaylist = useResetRecoilState(playlistStore)
  const playerRef = useRef<HTMLDivElement>(null)
  const [playerProps, playerCtrl] = useSpring(() => ({ from: initialPos }), [])
  const shouldShowPlayer = pathName?.startsWith('/r/')
  const roomId = shouldShowPlayer ? (params?.id as string) : undefined
  const isLivingRoom = pathName === `/r/${params?.id}`
  const isLightMode = !!searchParam.get('lightMode')

  const playerRepo = useMemo(() => {
    if (typeof roomId === 'undefined') {
      return undefined
    }

    return new PlayerStateRepository(roomId)
  }, [roomId])

  const onReady = () => {
    // play video at 0s
    player.current?.seekTo(0)
  }

  const handleVideoEndOrError = () => {
    playerEvent.emit('ended')
  }

  const onPlay = () => {
    console.log('onPlay')
    setIsPlaying(true)
  }

  const onPause = () => {
    console.log('onPause')
    setIsPlaying(false)
  }

  const clonePositionAndClass = useCallback(
    (
      distRef: HTMLElement | null,
      srcEleId: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      springCtrl: any,
      baseClass = 'fixed overflow-hidden w-full',
      isUseAnimation?: boolean
    ) => {
      const srcEle = document.getElementById(srcEleId)

      if (!srcEle) {
        springCtrl.set(initialPos)
        return
      }

      if (!distRef) {
        return
      }

      const srcEleRect = srcEle.getBoundingClientRect()
      const distEleRect = distRef.getBoundingClientRect()
      const totalDiffPos =
        Math.abs(distEleRect.left - srcEleRect.left) +
        Math.abs(distEleRect.top - srcEleRect.top)

      const shouldUseAnimation =
        typeof isUseAnimation !== 'undefined'
          ? isUseAnimation
          : totalDiffPos > 200

      const srcEleClass = Array.from(srcEle.classList)
        .filter((className) => {
          return [
            /^((xs|sm|lg|xl|hover|active|focus):)*rounded[lrtb]{0,2}?-.*/,
            /^((xs|sm|lg|xl|hover|active|focus):)*p[lrtb]-.*/,
          ].find((reg) => reg.test(className))
        })
        .join(' ')

      distRef.className = `${baseClass} ${srcEleClass}`

      const newProps = {
        top: srcEleRect.top,
        left: srcEleRect.left,
        width: srcEleRect.width,
        height: srcEleRect.height,
        opacity: 1,
        zIndex: 40,
      }

      if (shouldUseAnimation) {
        springCtrl.start(newProps)
      } else {
        springCtrl.set(newProps)
      }
    },
    []
  )

  useEffect(() => {
    if (!playerRepo) {
      return
    }

    const reactionHandler: SnapshotReactionHandler = (id, type) => {
      emitAddReaction({ id, type })
    }

    const unsubReaction = playerRepo.onSnapshotReaction(reactionHandler)

    return () => {
      unsubReaction()
      emitClearReaction()
    }
  }, [playerRepo])

  useEffect(() => {
    if (isLivingRoom) {
      document.onscroll = () => {
        clonePositionAndClass(
          playerRef.current,
          'video-placeholder',
          playerCtrl,
          'fixed overflow-hidden w-full group',
          false
        )
      }
    }
  }, [clonePositionAndClass, playerCtrl, isLivingRoom])

  const videoPlaceholderSizeChange: ResizeObserverCallback = useCallback(() => {
    clonePositionAndClass(
      playerRef.current,
      'video-placeholder',
      playerCtrl,
      'fixed overflow-hidden w-full group'
    )
  }, [clonePositionAndClass, playerCtrl])

  useEffect(() => {
    const srcEle = document.getElementById('video-placeholder')
    const wrapperEle = document.getElementById('video-wrapper')

    const resizeObserver = new ResizeObserver(videoPlaceholderSizeChange)

    Object.values({
      srcEle,
      wrapperEle,
    }).forEach((ele) => {
      if (ele) {
        resizeObserver.observe(ele)
      }
    })

    return () => {
      Object.values({
        srcEle,
        wrapperEle,
      }).forEach((ele) => {
        if (ele) {
          resizeObserver.unobserve(ele)
        }
      })
    }
  }, [videoPlaceholderSizeChange, pathName])

  // clear data
  useEffect(() => {
    return () => {
      resetPlaylist()
      resetCurSongReq()
    }
  }, [resetCurSongReq, shouldShowPlayer, roomId, resetPlaylist])

  return (
    <>
      <ReactionPool elementRef={playerRef} />
      <animated.div ref={playerRef} style={playerProps}>
        {curSongReq && (
          <ReactPlayer
            ref={player}
            url={youtubeVideoBaseUrl + curSongReq.song.id}
            playing={isPlaying}
            controls={true}
            onReady={onReady}
            onPlay={onPlay}
            onPause={onPause}
            onEnded={handleVideoEndOrError}
            onError={handleVideoEndOrError}
            width="100%"
            height="100%"
            light={isLightMode}
          />
        )}
      </animated.div>
    </>
  )
}

export default VideoPlayer
