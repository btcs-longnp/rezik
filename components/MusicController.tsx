import { FC, PropsWithChildren, useEffect, useState } from 'react';
import {
  IoPlayBack,
  IoPlayForward,
  IoShuffle,
  IoSync,
  IoTrashBin,
} from 'react-icons/io5';
import IconButton from './IconButton';

interface MusicControllerProps {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  shuffle: () => void;
  setIsSync: (isSync: boolean) => void;
  clearPlaylist: () => void;
}

const MusicController: FC<MusicControllerProps> = (props) => {
  const [isSync, setIsSync] = useState(true);

  const handleToggleSync = () => {
    setIsSync(!isSync);
  };

  useEffect(() => {
    props.setIsSync(isSync);
  }, [isSync, props]);

  return (
    <div className='flex justify-around items-center rounded-full px-3 py-2 bg-opacity-40 bg-gray-600'>
      <IconButton onClick={props.previous}>
        <IoPlayBack />
      </IconButton>
      <IconButton onClick={props.next}>
        <IoPlayForward />
      </IconButton>
      <IconButton onClick={props.shuffle}>
        <IoShuffle />
      </IconButton>
      <IconButton onClick={handleToggleSync}>
        <IoSync className={isSync ? `text-sky-400` : ''} />
      </IconButton>
      <IconButton onClick={props.clearPlaylist}>
        <IoTrashBin className='text-rose-400' />
      </IconButton>
    </div>
  );
};

export default MusicController;
