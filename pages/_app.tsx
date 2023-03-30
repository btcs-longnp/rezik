import '../styles/globals.css'
import type { AppProps } from 'next/app'
import '../services/initFirebase'
import { RecoilRoot } from 'recoil'
import Modal from '../components/atoms/Modal'
import VideoPlayer from '../components/templates/VideoPlayer'

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
