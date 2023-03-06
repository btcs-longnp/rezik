import { FC, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { Account } from '../../models/account/Account'
import { saveAccountToLocal } from '../../services/simpleAuth/localAccount'
import { currentUserStore } from '../../stores/currentUser'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import { closeModal, openModal } from '../atoms/Modal'
import SignUpAndProfile from './SignUpAndProfile'

const SignIn: FC = () => {
  const [magicToken, setMagicToken] = useState('')
  const setCurrentUser = useSetRecoilState(currentUserStore)
  const [isNotValidToken, setIsNotValidToken] = useState(false)

  const idInputDescription = isNotValidToken
    ? 'Not a valid Login Magic Token'
    : 'Copy your Login Magic Token and paste here'

  const changeMagicToken = (token: string) => {
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
      body: <SignUpAndProfile />,
    })
  }

  return (
    <div className="relative w-full h-full">
      <div className={`flex flex-col items-center`}>
        <div className="flex items-center mt-8 mb-12 text-xl font-semibold">
          Sign In
        </div>
        <div className="w-80 space-y-4">
          <div>
            <Input
              type="text"
              value={magicToken}
              onTextChange={changeMagicToken}
              label="Login Magic Token"
              description={idInputDescription}
              isError={isNotValidToken}
              autoFocus
            />
          </div>
        </div>
        <div className="mt-10 mb-4">
          <Button onClick={signIn} size="large" type="primary" className="w-36">
            Sign in
          </Button>
        </div>
        <div className="flex items-center mb-12 text-secondary/80">
          <div className="text-sm">Does not have an account?</div>
          <Button onClick={openSignUpModal} size="small" type="text">
            Create Free Account
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SignIn
