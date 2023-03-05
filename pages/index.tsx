import { useRef, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import ReactPlayer from 'react-player';

import SongRequest from '../models/songRequest/SongRequest';
import PlaylistBox from '../components/templates/playlistBox/PlaylistBox';
import { playerEvent } from '../models/eventEmitter/player';
import { useRecoilState } from 'recoil';
import { isPlayingStore } from '../stores/player';
import Modal from '../components/atoms/Modal';
import PlaylistBoxHeader from '../components/templates/playlistBox/PlaylistBoxHeader';
import { IoPlay } from 'react-icons/io5';

const youtubeVideoBaseUrl = 'https://www.youtube.com/watch?v=';

const Player: NextPage = () => {
  const player = useRef<any>();
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingStore);
  const [curSongReq, setCurSongReq] = useState<SongRequest>();

  const onReady = () => {
    console.log('player: onReady');
    setIsPlaying(true);
  };

  const handleVideoEndOrError = () => {
    playerEvent.emit('ended');
  };

  const onPlay = () => {
    console.log('onPlay');
    setIsPlaying(true);
  };

  const onPause = () => {
    console.log('onPause');
    setIsPlaying(false);
  };

  return (
    <div>
      <Head>
        <title>isling - Watch Video Together</title>
        <meta name='description' content="Let's watch videos together" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Modal />
      <main>
        <div className='grid grid-cols-[1fr_auto]'>
          <div className='relative h-screen'>
            {curSongReq ? (
              <ReactPlayer
                ref={player}
                url={youtubeVideoBaseUrl + curSongReq.song.id}
                playing={isPlaying}
                controls={true}
                onPlay={onPlay}
                onPause={onPause}
                onEnded={handleVideoEndOrError}
                onError={handleVideoEndOrError}
                onReady={onReady}
                width='100%'
                height='100%'
              />
            ) : (
              <div className='h-full grid grid-rows-[auto_1fr_auto]'>
                <div className='h-20 bg-black' />
                <div className='h-full bg-gray-400 grid place-items-center'>
                  <IoPlay className='text-9xl text-primary-light animate-pulse duration-300' />
                </div>
                <div className='h-20 bg-black' />
              </div>
            )}
          </div>
          <div className='w-96 h-screen overflow-hidden'>
            <PlaylistBox
              onSongReqChange={setCurSongReq}
              header={<PlaylistBoxHeader />}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Player;
