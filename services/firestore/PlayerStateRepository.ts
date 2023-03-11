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
  addDoc,
  query,
  where,
} from 'firebase/firestore'
import { PlayerState } from '../../models/playerState/playerState'
import { ReactionType } from '../../models/Reaction'

export type SnapshotControllerHandler = (state: PlayerState) => void
export type SnapshotReactionHandler = (id: string, type: ReactionType) => void

class PlayerStateRepository {
  baseURL = 'rezik'
  controllerCollection: CollectionReference
  reactionCollection: CollectionReference

  constructor(private roomId: string) {
    this.controllerCollection = collection(
      doc(collection(getFirestore(), this.baseURL), this.roomId),
      'playerStates'
    )
    this.reactionCollection = collection(
      doc(collection(getFirestore(), this.baseURL), this.roomId),
      'reactions'
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
    return setDoc(doc(this.controllerCollection, 'default'), state)
  }

  async updatePlayerState(state: Partial<PlayerState>) {
    return updateDoc(doc(this.controllerCollection, 'default'), state)
  }

  // Use local time (new Date()) instead of serverTimestamp
  // to make sure the users can view their reactions.
  // Because onSnapshotReaction only listen to docs that have changed since it was invoked.
  async reaction(type: ReactionType) {
    return addDoc(this.reactionCollection, { type, sendAt: new Date() })
  }

  onSnapshotReaction(handler: SnapshotReactionHandler): Unsubscribe {
    const q = query(this.reactionCollection, where('sendAt', '>=', new Date()))

    const unsub = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'added' && change.doc.data()) {
          handler(change.doc.id, change.doc.data().type as ReactionType)
        }
      })
    })

    return unsub
  }
}

export default PlayerStateRepository
