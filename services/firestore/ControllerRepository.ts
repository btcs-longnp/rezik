import {
  doc,
  deleteDoc,
  CollectionReference,
  collection,
  getFirestore,
  onSnapshot,
  Unsubscribe,
  setDoc,
} from 'firebase/firestore';

export type SnapshotControllerHandler = (controller: {
  songIndex: number;
}) => void;

class ControllerRepository {
  baseURL: string = 'rezik';
  controllerCollection: CollectionReference;

  constructor(private audience: string) {
    this.controllerCollection = collection(
      doc(collection(getFirestore(), this.baseURL), this.audience),
      'controllers'
    );
  }

  onSnapshotController(handler: SnapshotControllerHandler): Unsubscribe {
    const unsub = onSnapshot(
      doc(this.controllerCollection, 'default'),
      (doc) => {
        handler(doc.data() as { songIndex: number });
      }
    );

    return unsub;
  }

  async removeController() {
    return deleteDoc(doc(this.controllerCollection, 'default'));
  }

  async updateSongIndex(songIndex: number) {
    setDoc(doc(this.controllerCollection, 'default'), { songIndex });
  }
}

export default ControllerRepository;
