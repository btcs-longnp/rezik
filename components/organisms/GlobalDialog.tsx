'use client'
import EventEmitter from 'events'
import { FC, ReactElement, useCallback, useEffect, useState } from 'react'
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from '../atoms/dialog'

const eventEmitter = new EventEmitter()

let modalBody: ReactElement = <></>

export interface OpenModalOptions {
  title?: string
  body: ReactElement
}

export const openModal = (options: OpenModalOptions) => {
  modalBody = options.body

  eventEmitter.emit(
    'openModal',
    options.title !== undefined ? options.title : ''
  )
}

export const closeModal = () => {
  eventEmitter.emit('closeModal')
}

const GlobalDialog: FC = () => {
  const [title, setTitle] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [, forceUpdate] = useState(false)

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setTitle('')
    modalBody = <></>
  }, [])

  const openModal = useCallback(
    (title: string) => {
      setTitle(title)

      if (isOpen) {
        forceUpdate((fVal) => !fVal)
      }

      setIsOpen(true)
    },
    [isOpen]
  )

  useEffect(() => {
    eventEmitter.on('openModal', openModal)

    eventEmitter.on('closeModal', closeModal)

    return () => {
      eventEmitter.removeAllListeners('openModal')
      eventEmitter.removeAllListeners('closeModal')
    }
  }, [closeModal, isOpen, openModal])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>{modalBody}</div>
      </DialogContent>
    </Dialog>
  )
}

export default GlobalDialog
