import { FC, useEffect, useState } from 'react'
import {
  IoLogInOutline,
  IoLogOutOutline,
  IoPersonOutline,
  IoWarningOutline,
} from 'react-icons/io5'
import { Account } from '../../../models/account/Account'
import { isAnonymousUser } from '../../../models/user/User'
import { getAccountFromLocal } from '../../../services/simpleAuth/localAccount'
import { useAuth } from '../../../services/hook/useAuth'
import CopyButton from '../../atoms/CopyButton'
import Dropdown from '../../atoms/Dropdown'
import Menu, { MenuItem } from '../../atoms/Menu'
import { openModal } from '../../atoms/Modal'
import SignIn from '../SignIn'
import SignUpAndProfile from '../SignUpAndProfile'
import { getAvatarString } from '../../../services/utils/user'
import Link from 'next/link'

export interface HeaderProps {
  page?: 'player' | 'search'
}

const HomeHeader: FC<HeaderProps> = () => {
  const { currentUser, signOut } = useAuth()
  const [account, setAccount] = useState<Account>()

  const openModalSignUpOrProfile = () => {
    openModal({
      body: <SignUpAndProfile />,
    })
  }

  const openModalSignIn = () => {
    openModal({
      body: <SignIn />,
    })
  }

  const copyLoginMagicLink = () => {
    const btn = document.getElementById('copy-magic-link-btn')
    btn?.click()
  }

  useEffect(() => {
    if (!isAnonymousUser(currentUser)) {
      const acc = getAccountFromLocal()

      setAccount(acc)
      return
    }

    setAccount(undefined)
  }, [currentUser])

  const GuestMenu = (
    <Menu className="w-64">
      <div className="px-3 py-2">
        <div className="truncate">{currentUser.name}</div>
        <div className="flex items-center">
          <IoWarningOutline className="text-orange-500 text-md mr-1" />
          <div className="text-sm">Anonymous account</div>
        </div>
      </div>
      <MenuItem onClick={openModalSignUpOrProfile}>
        <div className="flex items-center">
          <IoPersonOutline className="text-xl" />
          <div className="ml-3">Sign Up</div>
        </div>
      </MenuItem>
      <MenuItem onClick={openModalSignIn}>
        <div className="flex items-center">
          <IoLogInOutline className="text-xl" />
          <div className="ml-3">Sign In</div>
        </div>
      </MenuItem>
    </Menu>
  )

  const UserMenu = (
    <Menu className="w-64">
      <div className="px-3 py-2">
        <div className="truncate max-w-[164px]">{currentUser.name}</div>
      </div>
      <MenuItem onClick={copyLoginMagicLink}>
        <div className="flex items-center">
          <CopyButton
            id="copy-magic-link-btn"
            className="text-xl"
            content={account?.toMagicToken() || ''}
          />
          <div className="ml-3">Copy Login Magic Token</div>
        </div>
      </MenuItem>
      <MenuItem onClick={openModalSignUpOrProfile}>
        <div className="flex items-center">
          <IoPersonOutline className="text-xl" />
          <div className="ml-3">Profile</div>
        </div>
      </MenuItem>
      <MenuItem onClick={signOut}>
        <div className="flex items-center">
          <IoLogOutOutline className="text-xl" />
          <div className="ml-3">Sign Out</div>
        </div>
      </MenuItem>
    </Menu>
  )

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
            Your room
          </Link>
          <Link href="/" className="text-lg font-semibold text-secondary/60">
            Search
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_auto] h-full text-secondary">
        <div className="flex items-center h-full space-x-6">
          <Link href="/">
            <div className="flex items-baseline">
              <span className="font-semibold opacity-80">ISLING</span>
              <div className="w-1 h-1 bg-secondary rounded-xs"></div>
              <span className="ml-0.5 text-xs font-normal text-primary-light font-mono">
                PLAY
              </span>
            </div>
          </Link>
        </div>
        <div className="flex items-center h-full space-x-3 lg:space-x-6">
          <Dropdown menu={isAnonymousUser(currentUser) ? GuestMenu : UserMenu}>
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-light cursor-pointer">
              {isAnonymousUser(currentUser) ? (
                <IoPersonOutline />
              ) : (
                <div className="text-sm">{getAvatarString(currentUser)}</div>
              )}
            </div>
          </Dropdown>
        </div>
      </div>
    </>
  )
}

export default HomeHeader