import { FC } from 'react'
import { IoPersonOutline } from 'react-icons/io5'
import Link from 'next/link'

import { GuestDropdownContent } from './UserDropdownContent'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/atoms/avatar'
import { IslingLogo } from '@/components/atoms/logo'

export interface HeaderProps {
  page?: 'player' | 'search'
}

const HomeHeaderForGuest: FC<HeaderProps> = () => {
  return (
    <>
      <div className="fixed z-[999] left-1/2 -translate-x-1/2 h-14 flex justify-center items-center text-secondary">
        <div className="w-[34rem] rounded-full flex justify-center items-center pr-2 space-x-12">
          <Link href="/" className="text-lg font-semibold  text-secondary/90">
            Home
          </Link>
          <Link href="/" className="text-lg font-semibold text-secondary/60">
            Explore
          </Link>
          <Link href="/" className="text-lg font-semibold text-secondary/60">
            Search
          </Link>
          <Link href="/" className="text-lg font-semibold text-secondary/60">
            Create account
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_auto] h-full text-secondary">
        <div className="flex items-center h-full space-x-6">
          <Link href="/">
            <IslingLogo />
          </Link>
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

export default HomeHeaderForGuest
