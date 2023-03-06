import { atom } from 'recoil'

export const isPlayingStore = atom<boolean>({
  key: 'isPlayingStore',
  default: true,
})
