'use client'
import EventEmitter from 'events'
import { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import IconButton from './buttons/IconButton'

const eventEmitter = new EventEmitter()

let modalBody: ReactElement = <></>

export interface OpenModalOptions {
  body: ReactElement
}

export const openModal = (options: OpenModalOptions) => {
  modalBody = options.body
  eventEmitter.emit('openModal')
}

export const closeModal = () => {
  eventEmitter.emit('closeModal')
}

const Modal: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [, setForceUpdate] = useState(true)

  const closeModal = useCallback(() => {
    modalBody = <></>
    setIsOpen(false)
  }, [])

  useEffect(() => {
    eventEmitter.on('openModal', () => {
      if (isOpen) {
        setForceUpdate((val) => !val)
      }

      setIsOpen(true)
    })

    eventEmitter.on('closeModal', () => {
      closeModal()
    })

    return () => {
      eventEmitter.removeAllListeners('openModal')
      eventEmitter.removeAllListeners('closeModal')
    }
  }, [isOpen, closeModal])

  return (
    <div
      className={`
        fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
        grid grid-rows-[auto_1fr_auto] w-1/3 min-h-[128px]
        bg-primary-light/70 text-secondary z-50
        rounded backdrop-blur
        ${isOpen ? 'block' : 'hidden'}
      `}
    >
      <div className="relative w-full">
        <div className="absolute top-2 right-2 z-20">
          <IconButton onClick={closeModal}>
            <IoClose className="text-secondary" />
          </IconButton>
        </div>
        {modalBody}
      </div>
    </div>
  )
}

export default Modal
