import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  CollectionReference,
  collection,
  getFirestore,
} from 'firebase/firestore';
import PlayList, { commitPlayList } from '../../models/songRequest/PlayList';

class PlayListRepository {
  baseURL: string;
  audience: string;
  playListCollection: CollectionReference;

  constructor(audience: string) {
    this.baseURL = 'rezik';
    this.audience = audience;
    this.playListCollection = collection(
      doc(collection(getFirestore(), this.baseURL), this.audience),
      'playlists'
    );
  }

  onSnapshotSongRequests() {
    // TODO: Implement
  }

  async setPlayList(playList: PlayList) {
    console.log('setPlayList', playList);
    const docSnap = await getDoc(doc(this.playListCollection, 'default'));
    if (docSnap.exists()) {
      if (docSnap.data().version !== playList.version) {
        console.log(
          `setPlayList: can not update: data on server has updated. Server: ver${
            docSnap.data().version
          }, Client: ver${playList.version}`
        );
        return;
      }
    }

    return setDoc(
      doc(this.playListCollection, 'default'),
      commitPlayList(playList)
    );
  }

  async removePlayList() {
    return deleteDoc(doc(this.playListCollection, 'default'));
  }
}

export default PlayListRepository;
