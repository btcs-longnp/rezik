import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import '@/services/initFirebase'
import { RecoilRoot } from 'recoil'
import Modal from '@com/atoms/Modal'
import VideoPlayer from '@com/templates/VideoPlayer'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Modal />
      <VideoPlayer />
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
