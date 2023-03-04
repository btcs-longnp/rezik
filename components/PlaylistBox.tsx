/* eslint-disable @next/next/no-img-element */
import { useRef, useEffect, useState, FC, useCallback } from 'react';

import { newYoutubeSong } from '../models/song/YoutubeSong';
import PlaylistRepository from '../services/firestore/PlaylistRepository';
import Playlist, { newPlaylist } from '../models/songRequest/Playlist';
import MusicController, { MusicControllerOptions } from './MusicController';
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
  musicControllerOptions?: MusicControllerOptions;
}

const PlaylistBox: FC<PlaylistBoxProps> = ({
  onSongReqChange,
  musicControllerOptions,
}) => {
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
  const isMouseEnterPlaylist = useRef(false);

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

  const handleMouseEnter = () => {
    console.log('### mouse enter playlist');
    isMouseEnterPlaylist.current = true;
  };

  const handleMouseLeave = () => {
    console.log('### mouse out');
    isMouseEnterPlaylist.current = false;
  };

  useEffect(() => {
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
    // prevent auto scroll when user are reacting with playlist
    if (isMouseEnterPlaylist.current) {
      return;
    }

    const songCardRef = document.getElementById(curSongReq.id);
    if (!songCardRef) {
      return;
    }

    songCardRef.scrollIntoView();
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

    return () => {
      playerEvent.removeListener('ended', handleVideoEndOrError);
      playerEvent.removeListener('error', handleVideoEndOrError);
    };
  }, [handleVideoEndOrError]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        isMouseEnterPlaylist.current = false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className='relative w-96 h-full'>
      <div className='absolute w-full h-full blur-3xl z-10'>
        <img
          src={curSongReq.song.thumbnail}
          alt=''
          className='object-cover h-full w-full'
        />
      </div>
      <div className='relative w-full h-full z-30 p-2 backdrop-blur-xl'>
        <div
          className='overflow-y-auto space-y-2 h-full'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {playlist.list.map((songReq) => (
            <SongCard
              key={songReq.id}
              songRequest={songReq}
              isCurSong={curSongReq.id === songReq.id}
              play={() => playBySongReqId(songReq.id)}
              remove={() => removeSongRequest(songReq.id)}
            />
          ))}
          <div className='h-16' />
        </div>
      </div>
      <div className='absolute bottom-0 w-full z-50 backdrop-blur-md'>
        <div className='relative p-2'>
          <MusicController
            next={next}
            previous={previous}
            shuffle={shufflePlaylist}
            setIsSync={handleSetIsSync}
            clearPlaylist={clearPlaylist}
            options={musicControllerOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default PlaylistBox;
