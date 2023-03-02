import { useRef, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import ReactPlayer from 'react-player';

import { newYoutubeSong } from '../models/song/YoutubeSong';
import SongRequest, { newSongRequest } from '../models/songRequest/SongRequest';
import { newUser } from '../models/user/User';
import PlaylistBox from '../components/PlaylistBox';
import { playerEvent } from '../models/eventEmitter/player';

const youtubeVideoBaseUrl = 'https://www.youtube.com/watch?v=';

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

const Player: NextPage = () => {
  const player = useRef<any>();
  const [isPlaying, setIsPlaying] = useState(true);
  const [curSongReq, setCurSongReq] = useState<SongRequest>(defaultSongReq);

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
        <meta name='description' content='Watch video together' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <div className='grid grid-cols-[1fr_auto]'>
          <div className='relative h-screen'>
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
          </div>
          <div className='w-96 h-screen relative overflow-hidden bg-[#282a36]'>
            <PlaylistBox onSongReqChange={setCurSongReq} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Player;
