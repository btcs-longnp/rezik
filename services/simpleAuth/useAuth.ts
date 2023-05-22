import { useCallback, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { getAnonymousUser, isAnonymousUser } from '@/models/user/User'
import {
  accountStore,
  currentUserStore,
  isLoadingAuthStore,
} from '@/stores/auth'

import { getAccountFromLocal } from './localAccount'

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserStore)
  const [isLoadingAuth, setIsLoadingAuth] = useRecoilState(isLoadingAuthStore)
  const [account, setAccount] = useRecoilState(accountStore)

  const signOut = useCallback(() => {
    setCurrentUser(getAnonymousUser())
    localStorage.removeItem('isling-me-kitsune')
  }, [setCurrentUser])

  useEffect(() => {
    if (account) {
      setIsLoadingAuth(false)
      return
    }

    setIsLoadingAuth(true)

    const accountLocal = getAccountFromLocal()

    setCurrentUser(accountLocal?.user || getAnonymousUser())

    setIsLoadingAuth(false)
  }, [account, setCurrentUser, setIsLoadingAuth])

  // update account if current user data changed
  // TODO: move logic to position that save account to local
  useEffect(() => {
    if (!isAnonymousUser(currentUser)) {
      const acc = getAccountFromLocal()

      setAccount(acc)
      return
    }

    setAccount(undefined)
  }, [currentUser, setAccount])

  return { currentUser, signOut, account, isLoadingAuth }
}
