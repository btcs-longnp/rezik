import { useCallback, useEffect, useMemo, useRef } from 'react'
import ReactPlayer from 'react-player'
import { useSpring, animated } from '@react-spring/web'

import { playerEvent } from '../../models/eventEmitter/player'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { curSongReqStore, isPlayingStore } from '../../stores/player'
import ReactionPool from '../../components/templates/ReactionPool'
import {
  emitAddReaction,
  emitClearReaction,
} from '../../services/emitter/reactionEmitter'
import PlayerStateRepository, {
  SnapshotReactionHandler,
} from '../../services/firestore/PlayerStateRepository'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Button from '../atoms/buttons/Button'
import { IoExpand } from 'react-icons/io5'
import { playlistStore } from '../../stores/playlist'

const youtubeVideoBaseUrl = 'https://www.youtube.com/watch?v='
const initialPos = {
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  opacity: 0,
  zIndex: 0,
}

const VideoPlayer = () => {
  const router = useRouter()
  const player = useRef<ReactPlayer>(null)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingStore)
  const curSongReq = useRecoilValue(curSongReqStore)
  const resetCurSongReq = useResetRecoilState(curSongReqStore)
  const resetPlaylist = useResetRecoilState(playlistStore)
  const playerRef = useRef<HTMLDivElement>(null)
  const [playerProps, playerCtrl] = useSpring(() => ({ from: initialPos }), [])
  const shouldShowPlayer = router.route.startsWith('/r/[id]')
  const roomId = shouldShowPlayer ? (router.query.id as string) : undefined
  const isMiniPlayer = router.route !== '/r/[id]'
  const livingRoom = `/r/${roomId}`

  const playerRepo = useMemo(() => {
    if (typeof roomId === 'undefined') {
      return undefined
    }

    return new PlayerStateRepository(roomId)
  }, [roomId])

  const onReady = () => {
    console.log('player: onReady')
    setIsPlaying(true)
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
    if (!player.current) {
      return
    }

    player.current.seekTo(0)
  }, [curSongReq])

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
    if (router.route === '/r/[id]') {
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
  }, [clonePositionAndClass, livingRoom, playerCtrl, router.route])

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
  }, [videoPlaceholderSizeChange, router.route])

  // clear data
  useEffect(() => {
    return () => {
      resetPlaylist()
      resetCurSongReq()
    }
  }, [resetCurSongReq, shouldShowPlayer, roomId, resetPlaylist])

  return (
    <div className={`${!shouldShowPlayer ? 'hidden' : ''}`}>
      <ReactionPool elementRef={playerRef} />
      <animated.div ref={playerRef} style={playerProps}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 invisible group-hover:visible">
          {isMiniPlayer && (
            <Link href={livingRoom}>
              <Button type="primary" size="large">
                <IoExpand className="mr-3 text-lg" />
                Expand
              </Button>
            </Link>
          )}
        </div>
        {curSongReq && (
          <ReactPlayer
            ref={player}
            url={youtubeVideoBaseUrl + curSongReq.song.id}
            playing={isPlaying}
            controls={true}
            onPlay={onPlay}
            onPause={onPause}
            onEnded={handleVideoEndOrError}
            onError={handleVideoEndOrError}
            onReady={onReady}
            width="100%"
            height="100%"
          />
        )}
      </animated.div>
    </div>
  )
}

export default VideoPlayer
