import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import '@/services/initFirebase'
import { RecoilRoot } from 'recoil'
import GlobalDialog from '@/components/organisms/GlobalDialog'
import VideoPlayer from '@com/templates/VideoPlayer'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <GlobalDialog />
      <VideoPlayer />
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
