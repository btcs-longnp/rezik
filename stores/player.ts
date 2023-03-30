import { atom } from 'recoil'
import SongRequest from '../models/songRequest/SongRequest'

export const isPlayingStore = atom<boolean>({
  key: 'isPlayingStore',
  default: true,
})

export const curSongReqStore = atom<SongRequest | undefined>({
  key: 'curSongReqStore',
  default: undefined,
})
