import '../styles/globals.css'
import type { AppProps } from 'next/app'
import '../services/initFirebase'
import { RecoilRoot } from 'recoil'
import Modal from '../components/atoms/Modal'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Modal />
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
