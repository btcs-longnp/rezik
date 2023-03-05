import { nanoid } from 'nanoid';
import { FC, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { newUser } from '../../models/user/User';
import { currentUserStore } from '../../stores/currentUser';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import { closeModal, openModal } from '../atoms/Modal';
import SignUpAndProfile from './SignUpAndProfile';

const SignIn: FC = () => {
  const [user, setUser] = useState(newUser('', ''));
  const setCurrentUser = useSetRecoilState(currentUserStore);
  const [isNotValidId, setIsNotValidId] = useState(false);

  const idInputDescription = isNotValidId
    ? "Not a valid account ID. Account ID should look like 'xsUhRUhNhMK9jXokL08Bi'"
    : 'Copy and paste your account ID here';

  const changeName = (name: string) => {
    if (name.length > 40) {
      return;
    }

    setUser(newUser(user.id, name));
  };

  const changeUserId = (id: string) => {
    setUser(newUser(id.trim(), user.name));
    setIsNotValidId(false);
  };

  const signIn = () => {
    if (user.id.length !== nanoid().length) {
      setIsNotValidId(true);
      return;
    }

    let name = user.name.trim();

    if (name === '') {
      name = 'Cáo Ẩn Danh';
    }

    setCurrentUser(newUser(user.id, name));
    closeModal();
  };

  const openSignUpModal = () => {
    openModal({
      body: <SignUpAndProfile />,
    });
  };

  return (
    <div className='relative w-full h-full'>
      <div className={`flex flex-col items-center`}>
        <div className='flex items-center mt-8 mb-12 text-xl font-semibold'>
          Sign In
        </div>
        <div className='w-80 space-y-4'>
          <div>
            <Input
              type='text'
              value={user.id}
              onTextChange={changeUserId}
              label='Account ID'
              description={idInputDescription}
              isError={isNotValidId}
              autoFocus
            />
          </div>
          <div>
            <Input
              type='text'
              value={user.name}
              onTextChange={changeName}
              label='Name'
            />
          </div>
        </div>
        <div className='mt-10 mb-4'>
          <Button onClick={signIn} size='large' type='primary' className='w-36'>
            Sign in
          </Button>
        </div>
        <div className='flex items-center mb-12 text-secondary/80'>
          <div className='text-sm'>Does not have an account?</div>
          <Button onClick={openSignUpModal} size='small' type='text'>
            Create Free Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
