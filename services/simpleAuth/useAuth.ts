import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { getAnonymousUser, isAnonymousUser } from '@/models/user/User'
import { currentUserStore } from '@/stores/currentUser'
import { Account } from '@/models/account/Account'

import { getAccountFromLocal } from './localAccount'

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserStore)
  const [account, setAccount] = useState<Account>()

  const signOut = useCallback(() => {
    setCurrentUser(getAnonymousUser())
    localStorage.removeItem('isling-me-kitsune')
  }, [setCurrentUser])

  useEffect(() => {
    const account = getAccountFromLocal()

    setCurrentUser(account?.user || getAnonymousUser())
  }, [setCurrentUser])

  useEffect(() => {
    if (!isAnonymousUser(currentUser)) {
      const acc = getAccountFromLocal()

      setAccount(acc)
      return
    }

    setAccount(undefined)
  }, [currentUser])

  return { currentUser, signOut, account }
}
