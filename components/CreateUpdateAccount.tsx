import { nanoid } from 'nanoid';
import { FC, useEffect, useState } from 'react';
import { IoCheckmarkCircle, IoCopy } from 'react-icons/io5';
import { useRecoilState } from 'recoil';
import { isAnonymousUser, newUser } from '../models/user/User';
import { currentUserStore } from '../stores/currentUser';
import Button from './atoms/Button';
import Input from './atoms/Input';

const CreateUpdateAccount: FC = () => {
  const [isDone, setIsDone] = useState(false);
  const [user, setUser] = useState(newUser('', ''));
  const [currentUser, setCurrentUser] = useRecoilState(currentUserStore);
  const [isCopyDone, setIsCopyDone] = useState(false);

  const isCreateAccount = isAnonymousUser(currentUser);

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

  const copyIdToClipboard = () => {
    navigator.clipboard.writeText(user.id);
    setIsCopyDone(true);
    setTimeout(() => {
      setIsCopyDone(false);
    }, 3000);
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
            {isCreateAccount
              ? 'Create Account Successfully'
              : 'Update Account Successfully'}
          </div>
        </div>
      )}
      <div
        className={`flex flex-col items-center ${
          isDone ? 'invisible' : 'visible'
        }`}
      >
        <div className='flex items-center mt-8 mb-12 text-xl font-semibold'>
          {isCreateAccount ? 'Create Account' : 'Your Account'}
        </div>
        <div className='w-80 space-y-4'>
          <div className='space-y-1'>
            <div>Account ID</div>
            <div className=''>
              <Input
                type='text'
                disabled
                value={user.id}
                addonAfter={
                  isCopyDone ? (
                    <IoCheckmarkCircle className='text-green-700' />
                  ) : (
                    <IoCopy
                      className='text-gray-400 hover:text-secondary cursor-pointer'
                      onClick={copyIdToClipboard}
                    />
                  )
                }
              />
            </div>
          </div>
          <div className='space-y-1'>
            <div className=''>Name</div>
            <div className=''>
              <Input
                type='text'
                autoFocus
                value={user.name}
                onTextChange={changeName}
              />
            </div>
          </div>
        </div>
        <div className='mt-10 mb-12'>
          <Button onClick={createAccount}>
            {isCreateAccount ? 'Create Account' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateUpdateAccount;
