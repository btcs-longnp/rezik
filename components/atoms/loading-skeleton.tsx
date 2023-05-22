'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from './skeleton'
import { IslingLogo } from './logo'
import { Avatar, AvatarFallback } from './avatar'

export function LoadingSkeleton() {
  const [items, setItems] = useState<number[]>([1])

  useEffect(() => {
    let i = 2
    let intervalId: NodeJS.Timer

    // eslint-disable-next-line prefer-const
    intervalId = setInterval(() => {
      console.log(i)

      setItems((val) => [...val, i])

      if (i === 4) {
        clearInterval(intervalId)
      }

      i += 1
    }, 250)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <div className="w-full overflow-x-hidden flex space-x-6 scrollbar-hide">
      {items.map((id) => (
        <div key={id} className="w-80">
          <Skeleton className="w-80 aspect-[16/9] bg-primary-light rounded" />
        </div>
      ))}
    </div>
  )
}

export function LoadingScreen() {
  return (
    <div className="fixed w-screen h-screen z-50 bg-primary">
      <div className="h-14 flex justify-between items-center px-6">
        <IslingLogo />
        <Avatar>
          <AvatarFallback></AvatarFallback>
        </Avatar>
      </div>
      <div className="mt-[9rem] mx-32">
        <LoadingSkeleton />
      </div>
    </div>
  )
}
