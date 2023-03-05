import { FC, HTMLProps, useState } from 'react';
import { IoCheckmarkCircle, IoCopy } from 'react-icons/io5';

export interface CopyButtonProps extends HTMLProps<HTMLButtonElement> {
  content: string;
  className?: string;
}

const CopyButton: FC<CopyButtonProps> = ({ content, className, ...props }) => {
  const [isCopyDone, setIsCopyDone] = useState(false);

  const copyIdToClipboard = () => {
    navigator.clipboard.writeText(content);
    setIsCopyDone(true);
    setTimeout(() => {
      setIsCopyDone(false);
    }, 1000);
  };

  return (
    <button {...(props as any)} onClick={copyIdToClipboard}>
      {isCopyDone ? (
        <IoCheckmarkCircle className={`${className} text-green-700`} />
      ) : (
        <IoCopy
          className={`${className} text-gray-400 hover:text-secondary cursor-pointer`}
        />
      )}
    </button>
  );
};

export default CopyButton;
