import { atom } from 'recoil'
import User, { getAnonymousUser } from '../models/user/User'
import { Account } from '@/models/account/Account'

export const currentUserStore = atom<User>({
  key: 'currentUserStore',
  default: getAnonymousUser(),
})

export const isLoadingAuthStore = atom<boolean>({
  key: 'isLoadingAuthStore',
  default: true,
})

export const accountStore = atom<Account | undefined>({
  key: 'accountStore',
  default: undefined,
})
