import { FC, PropsWithChildren } from 'react';

interface ControllerButtonProps {
  onClick: () => void;
}

const ControllerButton: FC<PropsWithChildren<ControllerButtonProps>> = ({
  children,
  onClick,
}) => (
  <button
    className='flex justify-center items-center rounded-full h-10 w-10 text-white font-semibold hover:bg-gray-800 bg-opacity-20'
    onClick={onClick}
  >
    {children}
  </button>
);

interface MusicControllerProps {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  clearPlaylist: () => void;
}

const MusicController: FC<MusicControllerProps> = (props) => {
  return (
    <div className='flex justify-around items-center rounded-full px-3 py-2 bg-opacity-40 bg-gray-300 gap-x-16'>
      <ControllerButton onClick={props.previous}>{'<<'}</ControllerButton>
      <ControllerButton onClick={props.play}>{'||'}</ControllerButton>
      <ControllerButton onClick={props.next}>{'>>'}</ControllerButton>
      <ControllerButton onClick={props.clearPlaylist}>x</ControllerButton>
    </div>
  );
};

export default MusicController;
