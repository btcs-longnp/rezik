import { FC, PropsWithChildren } from 'react';

interface ControllerButtonProps {
  onClick: () => void;
}

const IconButton: FC<PropsWithChildren<ControllerButtonProps>> = ({
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

export default IconButton;
