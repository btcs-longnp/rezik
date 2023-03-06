import {
  doc,
  deleteDoc,
  CollectionReference,
  collection,
  getFirestore,
  onSnapshot,
  Unsubscribe,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { PlayerState } from '../../models/playerState/playerState'

export type SnapshotControllerHandler = (state: PlayerState) => void

class PlayerStateRepository {
  baseURL = 'rezik'
  controllerCollection: CollectionReference

  constructor(private roomId: string) {
    this.controllerCollection = collection(
      doc(collection(getFirestore(), this.baseURL), this.roomId),
      'playerStates'
    )
  }

  onSnapshotController(handler: SnapshotControllerHandler): Unsubscribe {
    const unsub = onSnapshot(
      doc(this.controllerCollection, 'default'),
      (doc) => {
        handler(doc.data() as PlayerState)
      }
    )

    return unsub
  }

  async removeController() {
    return deleteDoc(doc(this.controllerCollection, 'default'))
  }

  async setPlayerState(state: PlayerState) {
    setDoc(doc(this.controllerCollection, 'default'), state)
  }

  async updatePlayerState(state: Partial<PlayerState>) {
    updateDoc(doc(this.controllerCollection, 'default'), state)
  }
}

export default PlayerStateRepository
