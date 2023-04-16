import { FC, PropsWithChildren } from 'react'

import HomeHeader from '../headers/HomeHeader'
import HomeHead from '../../atoms/heads/HomeHead'

const HomeLayout: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <div>
      <HomeHead />
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
