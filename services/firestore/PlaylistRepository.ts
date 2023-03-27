import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  CollectionReference,
  collection,
  getFirestore,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore'
import Playlist, { commitPlaylist } from '../../models/songRequest/Playlist'
import { unescape } from '../utils/string'

export type SnapshotPlaylistHandler = (playlist?: Playlist) => void

class PlaylistRepository {
  baseURL = 'rezik'
  playlistCollection: CollectionReference

  constructor(private roomId: string) {
    this.playlistCollection = collection(
      doc(collection(getFirestore(), this.baseURL), this.roomId),
      'playlists'
    )
  }

  onSnapshotPlaylist(handler: SnapshotPlaylistHandler): Unsubscribe {
    const unsub = onSnapshot(doc(this.playlistCollection, 'default'), (doc) => {
      const playlist = doc.data() ? (doc.data() as Playlist) : undefined

      if (playlist === undefined) {
        handler(playlist)

        return
      }

      playlist.list = playlist.list.map((item) => {
        item.song.title = unescape(item.song.title)

        return item
      })

      handler(playlist)
    })

    return unsub
  }

  async setPlaylist(playlist: Playlist) {
    console.log('setPlaylist', playlist)
    const defaultDoc = doc(this.playlistCollection, 'default')
    const docSnap = await getDoc(defaultDoc)

    if (docSnap.exists()) {
      if (docSnap.data().version !== playlist.version) {
        console.log(
          `setPlaylist: can not update: data on server has updated. Server: ver${
            docSnap.data().version
          }, Client: ver${playlist.version}`
        )
        return
      }
    }

    await setDoc(defaultDoc, commitPlaylist(playlist))
  }

  async removePlaylist() {
    return deleteDoc(doc(this.playlistCollection, 'default'))
  }
}

export default PlaylistRepository
