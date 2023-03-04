import { FC, PropsWithChildren } from 'react';

interface ControllerButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const IconButton: FC<PropsWithChildren<ControllerButtonProps>> = ({
  children,
  onClick,
  disabled,
}) => (
  <button
    className={`
      flex justify-center items-center rounded-full h-10 w-10 font-semibold bg-opacity-20
      text-white hover:bg-gray-800 active:bg-gray-900
      ${disabled ? 'cursor-not-allowed' : ''}
    `}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default IconButton;
