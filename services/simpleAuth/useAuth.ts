import { useCallback, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { getAnonymousUser } from '../../models/user/User'
import { currentUserStore } from '../../stores/currentUser'
import { getAccountFromLocal } from './localAccount'

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserStore)

  const signOut = useCallback(() => {
    setCurrentUser(getAnonymousUser())
    localStorage.removeItem('isling-me-kitsune')
  }, [setCurrentUser])

  useEffect(() => {
    const account = getAccountFromLocal()

    setCurrentUser(account?.user || getAnonymousUser())
  }, [setCurrentUser])

  return { currentUser, signOut }
}
