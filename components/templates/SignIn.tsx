import { FC, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { Account } from '@/models/account/Account'
import { saveAccountToLocal } from '@/services/simpleAuth/localAccount'
import { currentUserStore } from '@/stores/auth'

import { Button } from '../atoms/button'
import { Input } from '../atoms/input'
import { closeModal, openModal } from '../organisms/GlobalDialog'
import SignUpAndProfile from './SignUpAndProfile'
import { ChangeEvent } from 'react'
import { Label } from '../atoms/label'
import { IslingLogo } from '../atoms/logo'

const SignIn: FC = () => {
  const [magicToken, setMagicToken] = useState('')
  const setCurrentUser = useSetRecoilState(currentUserStore)
  const [isNotValidToken, setIsNotValidToken] = useState(false)

  const idInputDescription = isNotValidToken
    ? 'Not a valid Login Magic Token'
    : 'Copy your Login Magic Token and paste here'

  const changeMagicToken = (event: ChangeEvent<HTMLInputElement>) => {
    const token = event.target.value

    setMagicToken(token.trim())
    setIsNotValidToken(false)
  }

  const signIn = () => {
    const account = Account.fromMagicToken(magicToken)

    if (!account) {
      setIsNotValidToken(true)
      return
    }

    setCurrentUser(account.user)
    saveAccountToLocal(account)
    closeModal()
  }

  const openSignUpModal = () => {
    openModal({
      title: 'Sign up',
      body: <SignUpAndProfile />,
    })
  }

  return (
    <div className="relative w-full h-full">
      <div className="flex flex-col items-center">
        <div className="text-2xl mt-4 mb-10">
          <IslingLogo />
        </div>
        <div className="w-96 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="magicToken" className="mb-1">
              Login Magic Token
            </Label>
            <Input
              type="text"
              value={magicToken}
              name="magicToken"
              onChange={changeMagicToken}
              className={`${isNotValidToken ? 'border-red-600/80' : ''}`}
              autoFocus
            />
            <p
              className={`text-sm ${
                isNotValidToken ? 'text-red-600/80' : 'text-secondary/40'
              }`}
            >
              {idInputDescription}
            </p>
          </div>
        </div>
        <div className="mt-10 mb-4">
          <Button variant="highlight" onClick={signIn} className="w-36">
            Sign in
          </Button>
        </div>
        <div className="flex items-center mb-12 text-secondary/80">
          <div className="text-sm">Does not have an account?</div>
          <Button variant="link" size="sm" onClick={openSignUpModal}>
            Create Free Account
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SignIn
