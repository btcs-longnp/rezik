import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { getAnonymousUser, isAnonymousUser } from '../../models/user/User';
import { currentUserStore } from '../../stores/currentUser';
import {
  getLocalAccount,
  removeLocalAccount,
  setLocalAccount,
} from '../currentUser/currentUser';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserStore);

  const signOut = useCallback(() => {
    setCurrentUser(getAnonymousUser());
    removeLocalAccount();
  }, [setCurrentUser]);

  useEffect(() => {
    const localAccount = getLocalAccount();

    setCurrentUser(localAccount || getAnonymousUser());
  }, [setCurrentUser]);

  useEffect(() => {
    if (isAnonymousUser(currentUser)) {
      return;
    }

    setLocalAccount(currentUser);
  }, [currentUser]);

  return { currentUser, signOut };
};
