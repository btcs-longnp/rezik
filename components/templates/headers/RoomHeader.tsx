import { FC, useEffect, useRef, useState } from 'react'
import {
  IoChevronBack,
  IoClose,
  IoLogInOutline,
  IoLogOutOutline,
  IoPersonOutline,
  IoTvOutline,
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
import IconButton from '../../atoms/IconButton'
import { useRecoilState } from 'recoil'
import { searchQueryStore } from '../../../stores/search'
import { Room } from '../../../models/room/Room'

export interface HeaderProps {
  room?: Room
}

const RoomHeader: FC<HeaderProps> = ({ room }) => {
  const { currentUser, signOut } = useAuth()
  const [account, setAccount] = useState<Account>()
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryStore)
  const [keyword, setKeyword] = useState<string>(searchQuery)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeout = useRef<any>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const shouldFocusSearchInputOnMounted = useRef(true)

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
    if (!isAnonymousUser(currentUser)) {
      const acc = getAccountFromLocal()

      setAccount(acc)
      return
    }

    setAccount(undefined)
  }, [currentUser])

  useEffect(() => {
    if (searchQuery !== '' && shouldFocusSearchInputOnMounted.current) {
      searchInputRef.current?.focus()
      shouldFocusSearchInputOnMounted.current = false
    }
  }, [searchQuery])

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
        <div className="w-[34rem] rounded-full border border-primary-light flex items-center pr-2">
          <input
            ref={searchInputRef}
            value={keyword}
            placeholder="Search or type Youtube URL"
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
        <div className="flex items-center h-full space-x-8">
          <Link href="/" className="cursor-pointer">
            <div className="flex items-center space-x-0 group text-blue-300">
              <IoChevronBack className="text-2xl group-hover:brightness-75 group-active:scale-95" />
              <div className="font-light group-hover:brightness-75 text-sm hidden xl:block">
                Home
              </div>
            </div>
          </Link>
          <div className="max-w-[192px] flex items-center bg-primary-light rounded px-3 h-8">
            <IoTvOutline className="text-lg text-secondary/80" />
            <div className="truncate text-ellipsis ml-2 font-light text-secondary/90 text-sm">
              {room?.name}
            </div>
          </div>
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

export default RoomHeader
