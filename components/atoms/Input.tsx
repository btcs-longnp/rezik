import { ChangeEvent, FC, HTMLProps, ReactElement } from 'react';

export interface InputProps extends HTMLProps<HTMLInputElement> {
  onTextChange?: (text: string) => void;
  addonBefore?: ReactElement;
  addonAfter?: ReactElement;
}

const Input: FC<InputProps> = (props) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (props.onTextChange) {
      props.onTextChange(e.target.value);
    }
  };

  return (
    <div
      className={`
        grid grid-cols-[auto_1fr_auto] 
        ${props.className} 
        px-3 py-3 rounded bg-primary/90
      `}
    >
      <div className='h-full'>{props.addonBefore}</div>
      <input
        {...props}
        className='w-full h-full outline-none bg-transparent'
        onChange={handleChange}
      />
      <div className='h-full'>{props.addonAfter}</div>
    </div>
  );
};

export default Input;
