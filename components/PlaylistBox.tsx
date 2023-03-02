/* eslint-disable @next/next/no-img-element */
import { useRef, useEffect, useState, FC, useCallback } from 'react';

import { newYoutubeSong } from '../models/song/YoutubeSong';
import PlaylistRepository from '../services/firestore/PlaylistRepository';
import Playlist, { newPlaylist } from '../models/songRequest/Playlist';
import MusicController from './MusicController';
import SongCard from './SongCard';
import PlayerStateRepository from '../services/firestore/PlayerStateRepository';
import {
  newPlayerState,
  PlayerState,
  updatePlayerState,
} from '../models/playerState/playerState';
import SongRequest, { newSongRequest } from '../models/songRequest/SongRequest';
import { newUser } from '../models/user/User';
import { playerEvent } from '../models/eventEmitter/player';

const playlistRepo = new PlaylistRepository('isling');
const playlistStateRepo = new PlayerStateRepository('isling');

const defaultSong = newYoutubeSong(
  'dQw4w9WgXcQ',
  'Never Gonna Give You Up',
  'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  300
);

const defaultSongReq = newSongRequest(
  defaultSong,
  newUser('0000', 'isling'),
  '0000'
);

export interface PlaylistBoxProps {
  onSongReqChange?: (songReq: SongRequest) => void;
}

const PlaylistBox: FC<PlaylistBoxProps> = ({ onSongReqChange }) => {
  const [playlist, setPlaylist] = useState<Playlist>(newPlaylist([], 0));
  const [playerState, setPlayerState] = useState<PlayerState>(
    newPlayerState(defaultSongReq, 0)
  );
  const [isSync, setIsSync] = useState(true);
  const [curSongReq, setCurSongReq] = useState<SongRequest>(defaultSongReq);
  const songReqIndex = useRef(0);
  const songReqTotal = useRef(0);
  const syncFirstTimeDone = useRef(false);
  const shadowPlayerState = useRef(playerState);
  const shadowIsSync = useRef(isSync);

  const next = () => {
    if (songReqIndex.current >= playlist.list.length - 1) {
      return;
    }

    songReqIndex.current += 1;
    setCurSongReq(playlist.list[songReqIndex.current]);
  };

  const previous = () => {
    songReqIndex.current = Math.max(0, songReqIndex.current - 1);
    setCurSongReq(playlist.list[songReqIndex.current]);
  };

  const handleVideoEndOrError = useCallback(() => {
    if (songReqIndex.current >= playlist.list.length - 1) {
      playlistStateRepo.updatePlayerState({ endOfList: true });

      return;
    }

    songReqIndex.current += 1;
    setCurSongReq(playlist.list[songReqIndex.current]);
  }, [playlist.list]);

  const playBySongReqId = (songReqId: string) => {
    const idx = playlist.list.findIndex((songReq) => songReq.id === songReqId);

    songReqIndex.current = Math.max(0, idx);
    setCurSongReq(playlist.list[songReqIndex.current]);
  };

  const handleSetIsSync = (enable: boolean) => {
    if (!enable) {
      syncFirstTimeDone.current = false;
    }

    shadowIsSync.current = enable;
    setIsSync(enable);
  };

  const play = () => {};

  const pause = () => {};

  const removeSongRequest = async (rmSongReqId: string) => {
    const newList = [...playlist.list].filter(
      (songReq) => songReq.id !== rmSongReqId
    );
    const theNewPlaylist = newPlaylist(newList, playlist.version);

    await playlistRepo.setPlaylist(theNewPlaylist);
  };

  const clearPlaylist = async () => {
    await playlistRepo.removePlaylist();
    await playlistStateRepo.removeController();
    setPlaylist(newPlaylist([], 0));
    alert('Clear playlist successfully');
  };

  const shufflePlaylist = async () => {
    const list = [...playlist.list];
    const shuffleList = list.sort(() => Math.random() - 0.5);

    const theNewPlaylist = newPlaylist(shuffleList, playlist.version);
    await playlistRepo.setPlaylist(theNewPlaylist);
    songReqIndex.current = 0;
    setCurSongReq(shuffleList[songReqIndex.current]);
  };

  useEffect(() => {
    console.log(
      'player: change list or change playerState',
      playerState.requestId
    );

    if (playlist.list.length === 0) {
      setCurSongReq(defaultSongReq);
      songReqIndex.current = 0;
      return;
    }

    if (playerState.endOfList && playlist.list.length > songReqTotal.current) {
      songReqIndex.current = songReqTotal.current;
    } else {
      const curSongReqIdx = playlist.list.findIndex(
        (songReq) => songReq.id === playerState.requestId
      );

      if (curSongReqIdx >= 0) {
        songReqIndex.current = curSongReqIdx;
      } else {
        songReqIndex.current = Math.min(
          songReqIndex.current,
          playlist.list.length - 1
        );
      }
    }

    songReqTotal.current = playlist.list.length;

    setCurSongReq((val) => {
      if (val.id === playlist.list[songReqIndex.current].id) {
        return val;
      }

      return playlist.list[songReqIndex.current];
    });
  }, [playerState.endOfList, playerState.requestId, playlist]);

  useEffect(() => {
    if (onSongReqChange) {
      onSongReqChange(curSongReq);
    }
  }, [curSongReq, onSongReqChange]);

  useEffect(() => {
    shadowPlayerState.current = playerState;
  }, [playerState]);

  // change curSongReq -> change playerState
  useEffect(() => {
    if (shadowPlayerState.current.requestId === curSongReq.id) {
      return;
    }

    const theNewState = updatePlayerState(
      shadowPlayerState.current,
      curSongReq
    );

    console.log('player: change player state:', theNewState);

    if (shadowIsSync.current && syncFirstTimeDone.current) {
      playlistStateRepo.setPlayerState(theNewState);
    } else {
      setPlayerState(theNewState);
    }
  }, [curSongReq]);

  useEffect(() => {
    const unsubPlaylist = playlistRepo.onSnapshotPlaylist((playlist) => {
      console.log('player: playlist changed:', playlist);
      if (!playlist) return;

      setPlaylist(playlist);
    });

    return () => {
      unsubPlaylist();
    };
  }, []);

  useEffect(() => {
    if (!isSync) {
      return;
    }

    const unsubController = playlistStateRepo.onSnapshotController((state) => {
      console.log('player: player state changed:', state);

      if (state !== undefined) {
        setPlayerState(state);
      }

      syncFirstTimeDone.current = true;
    });

    return () => {
      unsubController();
    };
  }, [isSync]);

  useEffect(() => {
    playerEvent.on('ended', handleVideoEndOrError);
    playerEvent.on('error', handleVideoEndOrError);

    console.log('### player event', playerEvent);

    return () => {
      playerEvent.removeListener('ended', handleVideoEndOrError);
      playerEvent.removeListener('error', handleVideoEndOrError);
    };
  }, [handleVideoEndOrError]);

  return (
    <div>
      <div className='absolute w-96 h-full blur-3xl'>
        <img
          src={curSongReq.song.thumbnail}
          alt=''
          className='object-cover h-full w-full'
        />
      </div>
      <div className='w-96 h-screen grid grid-rows-[1fr_auto] z-50 p-2 bg-transparent relative'>
        <div className='overflow-y-auto space-y-2'>
          {playlist.list.map((songReq) => (
            <SongCard
              key={songReq.id}
              songRequest={songReq}
              isPlaying={curSongReq.id === songReq.id}
              play={() => playBySongReqId(songReq.id)}
              remove={() => removeSongRequest(songReq.id)}
            />
          ))}
        </div>
        <div>
          <MusicController
            play={play}
            pause={pause}
            next={next}
            previous={previous}
            shuffle={shufflePlaylist}
            setIsSync={handleSetIsSync}
            clearPlaylist={clearPlaylist}
          />
        </div>
      </div>
    </div>
  );
};

export default PlaylistBox;
