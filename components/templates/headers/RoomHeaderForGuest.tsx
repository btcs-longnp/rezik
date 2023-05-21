'use client'
import { FC, useEffect, useRef, useState } from 'react'
import {
  IoChevronBack,
  IoClose,
  IoPersonOutline,
  IoTvOutline,
} from 'react-icons/io5'
import Link from 'next/link'
import { useRecoilState } from 'recoil'
import { searchQueryStore } from '@/stores/search'
import { Room } from '@/models/room/Room'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/atoms/avatar'

import IconButton from '../../atoms/buttons/IconButton'
import { GuestDropdownContent } from './UserDropdownContent'

export interface RoomHeaderForGuestProps {
  room?: Room
  backBtn?: {
    url: string
    title: string
  }
  isShowRoom?: boolean
}

const RoomHeaderForGuest: FC<RoomHeaderForGuestProps> = ({
  room,
  backBtn,
  isShowRoom,
}) => {
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryStore)
  const [keyword, setKeyword] = useState<string>(searchQuery)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeout = useRef<any>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const shouldFocusSearchInputOnMounted = useRef(true)

  const handleChangeKeyword = (value: string) => {
    setKeyword(value)

    if (timeout.current) {
      clearTimeout(timeout.current)
    }

    timeout.current = setTimeout(function () {
      setSearchQuery(value)
      timeout.current = undefined
    }, 666)
  }

  const handleClearKeyword = () => {
    setKeyword('')
    searchInputRef.current?.focus()
  }

  useEffect(() => {
    if (searchQuery !== '' && shouldFocusSearchInputOnMounted.current) {
      searchInputRef.current?.focus()
      shouldFocusSearchInputOnMounted.current = false
    }
  }, [searchQuery])

  return (
    <>
      <div className="fixed z-[999] left-1/2 -translate-x-1/2 h-14 flex justify-center items-center text-secondary">
        <div className="w-[34rem] rounded-full border border-primary-light flex items-center pr-2">
          <input
            ref={searchInputRef}
            value={keyword}
            placeholder="Search or paste Youtube URL"
            className="w-full pl-4 py-2 outline-none bg-transparent font-light"
            onChange={({ target: { value } }) => handleChangeKeyword(value)}
          />
          {keyword.length > 0 && (
            <IconButton onClick={handleClearKeyword}>
              <IoClose className="text-secondary/50 hover:text-secondary text-lg" />
            </IconButton>
          )}
        </div>
      </div>
      <div className="grid grid-cols-[1fr_auto] h-full text-secondary">
        <div className="max-w-[192px] flex items-center h-full space-x-8">
          {backBtn && (
            <Link href={backBtn.url} className="cursor-pointer">
              <div className="flex items-center space-x-0 group text-blue-300">
                <IoChevronBack className="text-2xl group-hover:brightness-75 group-active:scale-95" />
                <div className="truncate text-ellipsis font-light group-hover:brightness-75 text-sm hidden xl:block">
                  {backBtn.title}
                </div>
              </div>
            </Link>
          )}
          {isShowRoom && (
            <div className="max-w-[192px] flex items-center bg-primary-light rounded px-3 h-8">
              <IoTvOutline className="text-lg text-secondary/80" />
              <div className="truncate text-ellipsis ml-2 font-light text-secondary/90 text-sm">
                {room?.name}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center h-full space-x-3 lg:space-x-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarFallback>
                  <IoPersonOutline />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <GuestDropdownContent />
          </DropdownMenu>
        </div>
      </div>
    </>
  )
}

export default RoomHeaderForGuest
