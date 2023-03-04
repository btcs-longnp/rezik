import { FC, PropsWithChildren } from 'react';

interface ControllerButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const IconButton: FC<PropsWithChildren<ControllerButtonProps>> = ({
  children,
  onClick,
  disabled,
}) => (
  <button
    className={`
      flex justify-center items-center rounded-full h-10 w-10 text-white font-semibold hover:bg-gray-800 bg-opacity-20
      ${disabled ? 'cursor-not-allowed' : ''}
    `}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default IconButton;
