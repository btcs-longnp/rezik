import { nanoid } from 'nanoid'
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { useRecoilState } from 'recoil'
import { Account } from '@/models/account/Account'
import { isAnonymousUser, newUser } from '@/models/user/User'
import {
  getAccountFromLocal,
  saveAccountToLocal,
} from '@/services/simpleAuth/localAccount'
import { currentUserStore } from '@/stores/currentUser'

import { Button } from '../atoms/button'
import { Input } from '../atoms/input'
import { Label } from '../atoms/label'
import { openModal } from '../organisms/GlobalDialog'
import SignIn from './SignIn'

const SignUpAndProfile: FC = () => {
  const [isDone, setIsDone] = useState(false)
  const [user, setUser] = useState(newUser('', ''))
  const account = useRef(new Account(''))
  const [currentUser, setCurrentUser] = useRecoilState(currentUserStore)
  const isCreateAccount = useRef(isAnonymousUser(currentUser))

  const changeName = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value

    if (name.length > 40) {
      return
    }

    setUser(newUser(user.id, name))
  }

  const createAccount = () => {
    let name = user.name.trim()

    if (name === '') {
      name = 'Cáo Ẩn Danh'
    }

    account.current.user.name = name
    saveAccountToLocal(account.current)

    setCurrentUser(account.current.user)

    setTimeout(() => {
      setIsDone(true)
    }, 300)
  }

  const openSignInModal = () => {
    openModal({
      title: 'Sign in',
      body: <SignIn />,
    })
  }

  useEffect(() => {
    if (!isAnonymousUser(currentUser)) {
      setUser(currentUser)
      const acc = getAccountFromLocal()

      if (acc) {
        account.current = acc
      }

      return
    }

    account.current = new Account('')
    setUser(newUser(nanoid(), ''))
  }, [currentUser])

  return (
    <div className="relative w-full h-full">
      {isDone && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center rounded z-10">
          <IoCheckmarkCircle className="text-5xl" />
          <div className="text-2xl mt-8">
            {isCreateAccount.current
              ? 'Sign Up Successfully'
              : 'Update Profile Successfully'}
          </div>
        </div>
      )}
      <div
        className={`flex flex-col items-center ${
          isDone ? 'invisible' : 'visible'
        }`}
      >
        <div className="w-96 space-y-4 mt-12">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              name="name"
              autoFocus
              value={user.name}
              onChange={changeName}
            />
          </div>
        </div>
        <div className="mt-10 mb-4">
          <Button variant="highlight" onClick={createAccount}>
            {isCreateAccount.current ? 'Sign up' : 'Save'}
          </Button>
        </div>
        {isCreateAccount.current && (
          <div className="flex items-center mb-12 text-secondary/80">
            <div className="text-sm">Already have an account?</div>
            <Button variant="link" size="sm" onClick={openSignInModal}>
              Sign in
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SignUpAndProfile
