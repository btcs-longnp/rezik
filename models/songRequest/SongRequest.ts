import { nanoid } from 'nanoid'
import Song from '../song/Song'
import User from '../user/User'

interface SongRequest {
  id: string
  song: Song
  user: User
  requestTime: Date
}

export const newSongRequest = (
  song: Song,
  user: User,
  requestId?: string
): SongRequest => {
  return {
    id: requestId || nanoid(),
    song,
    user,
    requestTime: new Date(),
  }
}

export default SongRequest
