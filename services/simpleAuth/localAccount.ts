import { Account } from '../../models/account/Account';
import User from '../../models/user/User';

const localStorageKey = 'isling-me-kitsune';

export const saveAccountToLocal = (account: Account) => {
  localStorage.setItem(localStorageKey, account.toMagicToken());
};

export const getAccountFromLocal = () => {
  const token = localStorage.getItem(localStorageKey);

  if (!token) {
    return undefined;
  }

  return Account.fromMagicToken(token);
};

export const removeAccountOnLocal = () => {
  localStorage.removeItem(localStorageKey);
};
