import { FC, PropsWithChildren, ReactElement } from 'react';

export interface DropdownProps {
  menu: ReactElement;
}

const Dropdown: FC<PropsWithChildren<DropdownProps>> = (props) => {
  return (
    <div className='relative group'>
      <div className='absolute top-full right-0 hidden group-hover:block pt-2'>
        {props.menu}
      </div>
      {props.children}
    </div>
  );
};

export default Dropdown;
