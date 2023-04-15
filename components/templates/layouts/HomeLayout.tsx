import Head from 'next/head'
import HomeHeader from '../headers/HomeHeader'
import { FC, PropsWithChildren } from 'react'

const HomeLayout: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <div>
      <Head>
        <title>isling | Watch Video Together</title>
        <meta name="description" content="Let's watch videos together" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <header className="fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary z-40">
          <HomeHeader />
        </header>
        <div className="h-28" />
        {children}
      </main>
    </div>
  )
}

export default HomeLayout
