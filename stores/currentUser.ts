import { atom } from 'recoil';
import User, { getAnonymousUser } from '../models/user/User';

export const currentUserStore = atom<User>({
  key: 'currentUserStore',
  default: getAnonymousUser(),
});
