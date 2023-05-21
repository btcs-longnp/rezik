'use client'
import { MouseEventHandler } from 'react'
import {
  LifeBuoy,
  Share2,
  LogOut,
  Plus,
  Settings,
  User,
  UserPlus,
  Users,
  LogIn,
} from 'lucide-react'

import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
} from '@/components/atoms/dropdown-menu'
import { useAuth } from '@/services/simpleAuth/useAuth'
import CopyButton from '@/components/atoms/buttons/CopyButton'
import { openModal } from '@/components/organisms/GlobalDialog'
import SignUpAndProfile from '../SignUpAndProfile'
import SignIn from '../SignIn'

export function UserDropdownContent() {
  const { currentUser, signOut, account } = useAuth()

  const copyMagicToken: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()

    const copyMagicTokenButton = document.getElementById('copy-magic-link-btn')

    copyMagicTokenButton?.click()
  }

  const openModalSignUpOrProfile = () => {
    openModal({
      title: 'Profile',
      body: <SignUpAndProfile />,
    })
  }

  return (
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel className="truncate">
        {currentUser.name}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={openModalSignUpOrProfile}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={copyMagicToken}>
          <CopyButton
            id="copy-magic-link-btn"
            className="h-4 w-4 mr-2"
            content={account?.toMagicToken() || ''}
          />
          <span>Copy Magic Token</span>
          <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" disabled>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem className="cursor-pointer" disabled>
          <Users className="mr-2 h-4 w-4" />
          <span>Team</span>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuItem className="cursor-pointer" disabled>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Invite users</span>
          </DropdownMenuItem>
        </DropdownMenuSub>
        <DropdownMenuItem className="cursor-pointer" disabled>
          <Plus className="mr-2 h-4 w-4" />
          <span>New Team</span>
          <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer" disabled>
        <Share2 className="mr-2 h-4 w-4" />
        <span>Get invite code</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer" disabled>
        <LifeBuoy className="mr-2 h-4 w-4" />
        <span>Support</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={signOut} className="cursor-pointer">
        <LogOut className="mr-2 h-4 w-4" />
        <span>Sign out</span>
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}

export function GuestDropdownContent() {
  const { currentUser } = useAuth()

  const openModalSignUpOrProfile = () => {
    openModal({
      title: 'Sign up',
      body: <SignUpAndProfile />,
    })
  }

  const openModalSignIn = () => {
    openModal({
      title: 'Sign in',
      body: <SignIn />,
    })
  }

  return (
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel className="truncate">
        {currentUser.name}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={openModalSignUpOrProfile}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Sign up</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={openModalSignIn}>
          <LogIn className="mr-2 h-4 w-4" />
          <span>Sign in</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="cursor-pointer" disabled>
        <LifeBuoy className="mr-2 h-4 w-4" />
        <span>Support</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
