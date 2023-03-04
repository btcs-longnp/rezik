import { FC } from 'react';
import { IoOpenOutline, IoPersonOutline } from 'react-icons/io5';
import { isAnonymousUser } from '../../models/user/User';
import { getAvatarString } from '../../services/currentUser/currentUser';
import { useAuth } from '../../services/hook/useAuth';
import Button from '../atoms/Button';
import { openModal } from '../atoms/Modal';
import CreateUpdateAccount from '../CreateUpdateAccount';

export interface PlaylistBoxHeaderProps {
  page?: 'player' | 'vote';
}

const PlaylistBoxHeader: FC<PlaylistBoxHeaderProps> = ({ page = 'player' }) => {
  const currentUser = useAuth();
  const openModalCreateUpdateAccount = () => {
    openModal({
      body: <CreateUpdateAccount />,
    });
  };

  return (
    <div className='grid grid-cols-[1fr_auto] h-full'>
      <div className=''></div>
      <div className='flex items-center h-full pr-2 space-x-1'>
        {page === 'player' ? (
          <Button
            link
            href='https://weplay.isling.me/'
            target='_blank'
            size='small'
          >
            Add song
            <IoOpenOutline className='ml-1' />
          </Button>
        ) : (
          <Button link href='/' target='_blank' size='small'>
            Open Player
            <IoOpenOutline className='ml-1' />
          </Button>
        )}

        <div
          className='flex items-center justify-center w-8 h-8 rounded-full bg-primary-light text-secondary cursor-pointer'
          onClick={openModalCreateUpdateAccount}
        >
          {isAnonymousUser(currentUser) ? (
            <IoPersonOutline />
          ) : (
            <div className='text-xs'>{getAvatarString(currentUser)}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistBoxHeader;
