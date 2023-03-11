/* eslint-disable @next/next/no-img-element */
import { animated, useSpring, easings } from '@react-spring/web'
import { FC, RefObject, useEffect, useRef, useState } from 'react'
import Reaction, { ReactionType } from '../../models/Reaction'
import { listenAddReaction } from '../../services/emitter/reactionEmitter'
import ReactionIcon from '../atoms/ReactionIcon'

export interface ReactionBubbleProps {
  reactionType: ReactionType
  poolRect?: DOMRect
}

const ReactionBubble: FC<ReactionBubbleProps> = ({
  poolRect,
  reactionType,
}) => {
  const [props] = useSpring(() => {
    if (!poolRect) {
      return {}
    }

    return {
      to: {
        x: poolRect.right - poolRect.width * Math.random() * 0.4 - 64,
        y: poolRect.top,
        scale: 0.5 + 0.3 * Math.random(),
        opacity: 0,
      },
      from: {
        x: poolRect.right - 64 - poolRect.height * Math.random() * 0.2,
        y: poolRect.bottom - 64,
        scale: 1,
        opacity: 1,
      },
      config: {
        mass: 1,
        friction: 120,
        tension: 80,
        easing: easings.easeInCubic,
        duration: 3000,
      },
    }
  }, [poolRect])

  return (
    <animated.div className="fixed z-50 w-16 h-16" style={props}>
      <ReactionIcon type={reactionType} />
    </animated.div>
  )
}

export interface ReactionPoolProps {
  elementRef: RefObject<HTMLDivElement>
}

const ReactionPool: FC<ReactionPoolProps> = ({ elementRef }) => {
  const reactionPool = useRef<Reaction[]>([])
  const [reactions, setReactions] = useState<Reaction[]>([])

  useEffect(() => {
    const handleAddReaction = ({
      id,
      type,
    }: {
      id: string
      type: ReactionType
    }) => {
      reactionPool.current.push({
        id,
        type,
        arrivedAt: Date.now(),
      })
    }

    const unsubAddReaction = listenAddReaction(handleAddReaction)

    const showReactionId = setInterval(() => {
      const firstEmotions = reactionPool.current.slice(0, 10)
      reactionPool.current.splice(0, 10)
      setReactions((val) => {
        const activeVal = val.filter((v) => v.arrivedAt > Date.now() - 8000)

        return activeVal.concat(firstEmotions)
      })
    }, 200)

    return () => {
      unsubAddReaction()
      clearInterval(showReactionId)
    }
  }, [])

  return (
    <>
      {reactions.map((reaction) => (
        <ReactionBubble
          reactionType={reaction.type}
          poolRect={elementRef.current?.getBoundingClientRect()}
          key={reaction.id}
        />
      ))}
    </>
  )
}

export default ReactionPool
