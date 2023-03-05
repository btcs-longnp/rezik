import { nanoid } from 'nanoid';
import { FC, useEffect, useRef, useState } from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { useRecoilState } from 'recoil';
import { isAnonymousUser, newUser } from '../../models/user/User';
import { currentUserStore } from '../../stores/currentUser';
import Button from '../atoms/Button';
import CopyButton from '../atoms/CopyButton';
import Input from '../atoms/Input';

const SignUpAndProfile: FC = () => {
  const [isDone, setIsDone] = useState(false);
  const [user, setUser] = useState(newUser('', ''));
  const [currentUser, setCurrentUser] = useRecoilState(currentUserStore);
  const isCreateAccount = useRef(isAnonymousUser(currentUser));

  const changeName = (name: string) => {
    if (name.length > 40) {
      return;
    }

    setUser(newUser(user.id, name));
  };

  const createAccount = () => {
    let name = user.name.trim();

    if (name === '') {
      name = 'Cáo Ẩn Danh';
    }

    setCurrentUser(newUser(user.id, name));

    setTimeout(() => {
      setIsDone(true);
    }, 300);
  };

  useEffect(() => {
    if (!isAnonymousUser(currentUser)) {
      setUser(currentUser);
      return;
    }

    setUser(newUser(nanoid(), ''));
  }, [currentUser]);

  return (
    <div className='relative w-full h-full'>
      {isDone && (
        <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-green-700 bg-opacity-80 rounded z-10'>
          <IoCheckmarkCircle className='text-5xl' />
          <div className='text-2xl mt-8'>
            {isCreateAccount.current
              ? 'Sign Up Successfully'
              : 'Update Profile Successfully'}
          </div>
        </div>
      )}
      <div
        className={`flex flex-col items-center ${
          isDone ? 'invisible' : 'visible'
        }`}
      >
        <div className='flex items-center mt-8 mb-12 text-xl font-semibold'>
          {isCreateAccount.current ? 'Sign Up' : 'Your Profile'}
        </div>
        <div className='w-80 space-y-4'>
          <div>
            <Input
              type='text'
              disabled
              value={user.id}
              addonAfter={<CopyButton content={user.id} />}
              label='Account ID'
            />
          </div>
          <div>
            <Input
              type='text'
              autoFocus
              value={user.name}
              onTextChange={changeName}
              label='Name'
            />
          </div>
        </div>
        <div className='mt-10 mb-12'>
          <Button onClick={createAccount} size='large' type='primary'>
            {isCreateAccount.current ? 'Sign up' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUpAndProfile;
