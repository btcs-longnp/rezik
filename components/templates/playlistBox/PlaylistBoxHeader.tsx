import { FC, useEffect, useState } from 'react'
import {
  IoLogInOutline,
  IoLogOutOutline,
  IoOpenOutline,
  IoPersonOutline,
  IoWarningOutline,
} from 'react-icons/io5'
import { Account } from '../../../models/account/Account'
import { isAnonymousUser } from '../../../models/user/User'
import { getAccountFromLocal } from '../../../services/simpleAuth/localAccount'
import { useAuth } from '../../../services/hook/useAuth'
import Button from '../../atoms/Button'
import CopyButton from '../../atoms/CopyButton'
import Dropdown from '../../atoms/Dropdown'
import Menu, { MenuItem } from '../../atoms/Menu'
import { openModal } from '../../atoms/Modal'
import SignIn from '../SignIn'
import SignUpAndProfile from '../SignUpAndProfile'
import { getAvatarString } from '../../../services/utils/user'

export interface PlaylistBoxHeaderProps {
  page?: 'player' | 'vote'
}

const PlaylistBoxHeader: FC<PlaylistBoxHeaderProps> = ({ page = 'player' }) => {
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
    <Menu className="w-48">
      <div className="px-3 py-2">
        <div className="text-sm truncate">{currentUser.name}</div>
        <div className="flex items-center">
          <IoWarningOutline className="text-orange-500 text-md mr-1" />
          <div className="text-xs">Anonymous account</div>
        </div>
      </div>
      <MenuItem onClick={openModalSignUpOrProfile}>
        <div className="flex items-center">
          <IoPersonOutline className="text-md" />
          <div className="ml-2">Sign Up</div>
        </div>
      </MenuItem>
      <MenuItem onClick={openModalSignIn}>
        <div className="flex items-center">
          <IoLogInOutline className="text-md" />
          <div className="ml-2">Sign In</div>
        </div>
      </MenuItem>
    </Menu>
  )

  const UserMenu = (
    <Menu className="w-48">
      <div className="px-3 py-2">
        <div className="text-sm truncate max-w-[164px]">{currentUser.name}</div>
      </div>
      <MenuItem onClick={copyLoginMagicLink}>
        <div className="flex items-center">
          <CopyButton
            id="copy-magic-link-btn"
            content={account?.toMagicToken() || ''}
          />
          <div className="ml-2 text-xs">Copy Login Magic Token</div>
        </div>
      </MenuItem>
      <MenuItem onClick={openModalSignUpOrProfile}>
        <div className="flex items-center">
          <IoPersonOutline className="text-md" />
          <div className="ml-2">Profile</div>
        </div>
      </MenuItem>
      <MenuItem onClick={signOut}>
        <div className="flex items-center">
          <IoLogOutOutline className="text-md" />
          <div className="ml-2">Sign Out</div>
        </div>
      </MenuItem>
    </Menu>
  )

  return (
    <div className="grid grid-cols-[1fr_auto] h-full">
      <div className=""></div>
      <div className="flex items-center h-full pr-2 space-x-1">
        {page === 'player' ? (
          <Button
            component="link"
            href="https://weplay.isling.me/"
            target="_blank"
            size="small"
            type="primary"
          >
            Add song
            <IoOpenOutline className="ml-1" />
          </Button>
        ) : (
          <Button
            component="link"
            href="/"
            target="_blank"
            size="small"
            type="primary"
          >
            Open Player
            <IoOpenOutline className="ml-1" />
          </Button>
        )}
        <Dropdown menu={isAnonymousUser(currentUser) ? GuestMenu : UserMenu}>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-light text-secondary cursor-default">
            {isAnonymousUser(currentUser) ? (
              <IoPersonOutline />
            ) : (
              <div className="text-xs">{getAvatarString(currentUser)}</div>
            )}
          </div>
        </Dropdown>
      </div>
    </div>
  )
}

export default PlaylistBoxHeader
