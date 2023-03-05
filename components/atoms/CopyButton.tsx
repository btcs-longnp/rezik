import { FC, useState } from 'react';
import { IoCheckmarkCircle, IoCopy } from 'react-icons/io5';

export interface CopyButtonProps {
  content: string;
  className?: string;
}

const CopyButton: FC<CopyButtonProps> = ({ content, className }) => {
  const [isCopyDone, setIsCopyDone] = useState(false);

  const copyIdToClipboard = () => {
    navigator.clipboard.writeText(content);
    setIsCopyDone(true);
    setTimeout(() => {
      setIsCopyDone(false);
    }, 1000);
  };

  return isCopyDone ? (
    <IoCheckmarkCircle className={`${className} text-green-700`} />
  ) : (
    <IoCopy
      className={`${className} text-gray-400 hover:text-secondary cursor-pointer`}
      onClick={copyIdToClipboard}
    />
  );
};

export default CopyButton;
