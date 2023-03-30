import { atom } from 'recoil'

export const searchQueryStore = atom<string>({
  key: 'searchQueryStore',
  default: '',
})
