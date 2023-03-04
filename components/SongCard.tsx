/* eslint-disable @next/next/no-img-element */
import { FC } from 'react';
import { IoPlay, IoTrash } from 'react-icons/io5';
import SongRequest from '../models/songRequest/SongRequest';
import IconButton from './IconButton';

export interface SongCardProps {
  songRequest: SongRequest;
  isCurSong: boolean;
  play: () => void;
  remove: () => void;
}

const SongCard: FC<SongCardProps> = ({
  songRequest,
  isCurSong: isPlaying,
  play,
  remove,
}) => {
  return (
    <div
      id={songRequest.id}
      className={`grid grid-cols-[auto_1fr] group hover:bg-teal-800 hover:bg-opacity-40 ${
        isPlaying ? 'bg-rose-400 bg-opacity-75' : ''
      }`}
    >
      <div className='w-20 h-20 relative'>
        {isPlaying && (
          <div className='absolute w-full h-full grid place-items-center'>
            <IoPlay
              size={32}
              className='animate-pulse duration-1000 text-[#f8f8f2]'
            />
          </div>
        )}
        <img
          src={songRequest.song.thumbnail}
          alt=''
          className='object-cover w-full h-full'
        />
      </div>
      <div className='pl-2 text-[#f8f8f2] h-full relative'>
        <div className='font-light text-sm group-hover:hidden'>
          {songRequest.song.title.slice(0, 86)}
        </div>
        <div className='hidden group-hover:block h-full'>
          <div className='flex items-center space-x-2 h-full'>
            <IconButton onClick={play}>
              <IoPlay />
            </IconButton>
            <IconButton onClick={remove}>
              <IoTrash className='text-rose-400' />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
