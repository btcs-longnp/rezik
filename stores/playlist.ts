import { atom } from 'recoil'
import Playlist, { newPlaylist } from '../models/songRequest/Playlist'

export const playlistStore = atom<Playlist>({
  key: 'playlistStore',
  default: newPlaylist([], 0),
})
