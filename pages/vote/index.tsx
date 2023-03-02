import type { NextPage } from 'next';
import Head from 'next/head';

import PlaylistBox from '../../components/PlaylistBox';

const Vote: NextPage = () => {
  return (
    <div>
      <Head>
        <title>isling - Watch Video Together</title>
        <meta name='description' content='Watch video together' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <div className='grid grid-cols-[1fr_auto]'>
          <div className='relative h-screen grid place-items-center'>
            Search video placeholder
          </div>
          <div className='w-96 h-screen relative overflow-hidden bg-[#282a36]'>
            <PlaylistBox />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Vote;
