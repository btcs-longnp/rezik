import { FC, PropsWithChildren, ReactElement } from 'react'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'

export interface RollProps {
  title?: ReactElement
}

const Roll: FC<PropsWithChildren<RollProps>> = ({ title, children }) => {
  return (
    <>
      <div className="grid grid-cols-[1fr_auto] mb-4">
        {title}
        <div className="flex h-full items-end space-x-4">
          <div className="w-9 h-9 border border-secondary/5 rounded-full flex justify-center items-center cursor-pointer active:scale-95 hover:bg-primary-light/40 transition-all duration-100">
            <IoChevronBackOutline className="text-secondary/20" />
          </div>
          <div className="w-9 h-9 border border-secondary/20 rounded-full flex justify-center items-center cursor-pointer active:scale-95 hover:bg-primary-light/40 transition-all duration-100">
            <IoChevronForwardOutline className="text-secondary/80" />
          </div>
        </div>
      </div>
      <div className="w-full overflow-x-auto flex space-x-6 scrollbar-hide">
        {children}
      </div>
    </>
  )
}

export default Roll
