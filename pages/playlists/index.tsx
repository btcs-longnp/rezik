/* eslint-disable @next/next/no-img-element */
import { useRef, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

import YoutubeSong, { newYoutubeSong } from '../../models/song/YoutubeSong';
import PlaylistRepository from '../../services/firestore/PlaylistRepository';
import Playlist, { newPlaylist } from '../../models/songRequest/Playlist';
import MusicController from '../../components/MusicController';
import SongCard from '../../components/SongCard';
import ControllerRepository from '../../services/firestore/ControllerRepository';

const playlistRepo = new PlaylistRepository('isling');
const controllerRepo = new ControllerRepository('isling');

const Playlist: NextPage = () => {
  const player = useRef<any>();
  const [playlist, setPlaylist] = useState<Playlist>(newPlaylist([], 0));
  const [songIndex, setSongIndex] = useState<number>(0);
  const [isSync, setIsSync] = useState(true);
  const [song, setSong] = useState<YoutubeSong>();
  const currentRequestId = useRef<string>('');
  const prevPlaylistLength = useRef<number>(0);
  const shadowSongIndex = useRef<number>(0);
  const syncFirstTimeDone = useRef(false);

  const next = () => {
    setSongIndex((val) => val + 1);
  };

  const previous = () => {
    setSongIndex((val) => Math.max(0, val - 1));
  };

  const playBySongIndex = (songIndex: number) => {
    setSongIndex(songIndex);
  };

  const play = () => {};

  const onPlay = () => {
    console.log('onPlay');
  };

  const pause = () => {};

  const onPause = () => {
    console.log('onPause');
  };

  const removeSongRequest = async (index: number) => {
    const newList = [...playlist.list];
    newList.splice(index, 1);
    const theNewPlaylist = newPlaylist(newList, playlist.version);

    await playlistRepo.setPlaylist(theNewPlaylist);
  };

  const clearPlaylist = async () => {
    await playlistRepo.removePlaylist();
    await controllerRepo.removeController();
    setPlaylist(newPlaylist([], 0));
    alert('Clear playlist successfully');
  };

  const shufflePlaylist = async () => {
    const list = [...playlist.list];
    const shuffleList = list.sort(() => Math.random() - 0.5);

    const theNewPlaylist = newPlaylist(shuffleList, playlist.version);
    await playlistRepo.setPlaylist(theNewPlaylist);
    setSongIndex(0);
  };

  useEffect(() => {
    if (playlist.list.length === 0) {
      return;
    }
    const request = playlist.list[songIndex % playlist.list.length];

    // in case playlist changed but current songRequest is not changed
    if (request.id === currentRequestId.current) {
      return;
    }

    setSong(request.song);
    currentRequestId.current = request.id;
  }, [playlist, songIndex]);

  useEffect(() => {
    console.log('player: change song:', song);
    if (!player.current) {
      return;
    }

    player.current.seekTo(0);
  }, [song]);

  useEffect(() => {
    console.log('player: change songIndex:', songIndex);
    shadowSongIndex.current = songIndex;

    if (isSync && syncFirstTimeDone.current) {
      controllerRepo.updateSongIndex(songIndex);
    }
  }, [songIndex, isSync]);

  useEffect(() => {
    const unsubPlaylist = playlistRepo.onSnapshotPlaylist((playlist) => {
      console.log('player: playlist changed:', playlist);
      if (!playlist) return;

      setPlaylist(playlist);

      if (
        shadowSongIndex.current >= prevPlaylistLength.current && // all songs are played
        playlist.list.length > prevPlaylistLength.current // playlist added
      ) {
        // then play new song
        setSongIndex(prevPlaylistLength.current);
      }

      prevPlaylistLength.current = playlist.list.length;
    });

    return () => {
      currentRequestId.current = '';
      unsubPlaylist();
    };
  }, []);

  useEffect(() => {
    if (!isSync) {
      return;
    }

    const unsubController = controllerRepo.onSnapshotController(
      ({ songIndex }) => {
        console.log('player: song index changed:', songIndex);

        setSongIndex(songIndex);
        syncFirstTimeDone.current = true;
      }
    );

    return () => {
      unsubController();
    };
  }, [isSync]);

  return (
    <div>
      <Head>
        <title>isling - Watch Video Together</title>
        <meta name='description' content='Watch video together' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <div className='grid grid-cols-[1fr_auto]'>
          <div className='relative h-screen'></div>
          <div className='w-96 h-screen relative overflow-hidden bg-[#282a36]'>
            <div className='absolute w-96 h-full blur-3xl'>
              {song && (
                <img
                  src={song.thumbnail}
                  alt=''
                  className='object-cover h-full w-full'
                />
              )}
            </div>
            <div className='w-96 h-screen grid grid-rows-[1fr_auto] z-50 p-2 bg-transparent relative'>
              <div className='overflow-y-auto space-y-2'>
                {playlist.list.map((songReq, index) => (
                  <SongCard
                    key={songReq.id}
                    songRequest={songReq}
                    isPlaying={index === songIndex % playlist.list.length}
                    play={() => playBySongIndex(index)}
                    remove={() => removeSongRequest(index)}
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
                  setIsSync={setIsSync}
                  clearPlaylist={clearPlaylist}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Playlist;
