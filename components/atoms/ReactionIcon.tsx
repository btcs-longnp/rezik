/* eslint-disable @next/next/no-img-element */
import { FC } from 'react'
import { ReactionType } from '../../models/Reaction'

const icons: Record<ReactionType, { src: string; alt: string }> = {
  haha: {
    src: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Grinning%20Squinting%20Face.png',
    alt: 'Grinning Squinting Face',
  },
  heart: {
    src: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Sparkling%20Heart.png',
    alt: 'Sparkling Heart',
  },
  sad: {
    src: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Disappointed%20Face.png',
    alt: 'Disappointed Face',
  },
  surprise: {
    src: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Open%20Mouth.png',
    alt: 'Face with Open Mouth',
  },
  wry: {
    src: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Cat%20with%20Wry%20Smile.png',
    alt: 'Cat with Wry Smile',
  },
  angry: {
    src: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Confounded%20Face.png',
    alt: 'Confounded Face',
  },
}

export interface ReactionIconProps {
  type: ReactionType
  className?: string
}

const ReactionIcon: FC<ReactionIconProps> = ({ type, className }) => {
  return (
    <img
      src={icons[type].src}
      alt={icons[type].alt}
      className={`w-full h-full ${className}`}
    />
  )
}

export default ReactionIcon
