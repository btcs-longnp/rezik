'use client'

import { usePathname } from 'next/navigation'
import { lazy } from 'react'

export const VideoPlayerLazy = lazy(() => import('./VideoPlayer'))

export function VideoPlayerOptimized() {
  const pathName = usePathname()
  const shouldShowPlayer = pathName?.startsWith('/r/')

  return !shouldShowPlayer ? <></> : <VideoPlayerLazy />
}
