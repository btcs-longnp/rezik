import { useRef, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Youtube, { Options } from 'react-youtube';
import YoutubeSong, { newYoutubeSong } from '../models/song/YoutubeSong';

const youtubeOpts: Options = {
  playerVars: {
    autoplay: 1,
  },
};

const defaultSong = newYoutubeSong('dQw4w9WgXcQ', 'Never Gonna Give You Up');

const Player: NextPage = () => {
  const player = useRef<any>();
  const [song, setSong] = useState<YoutubeSong>(defaultSong);

  const onReady = (event: { target: any }) => {
    console.log('player: onReady');
    player.current = event.target;
  };
  const handlePlay = () => {};
  const handlePause = () => {};
  const handleStageChange = () => {};

  useEffect(() => {
    console.log('player: change song:', song);
    if (!player.current) {
      return;
    }

    player.current.seekTo(0, true);
  }, [song]);

  return (
    <div>
      <Head>
        <title>Rezik - Play Your Album</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <Youtube
          containerClassName='h-screen w-auto'
          className='h-full w-full'
          videoId={song.id}
          opts={youtubeOpts}
          onReady={onReady}
          onStateChange={handleStageChange}
          onPlay={handlePlay}
          onPause={handlePause}
        />
      </main>
    </div>
  );
};

export default Player;
