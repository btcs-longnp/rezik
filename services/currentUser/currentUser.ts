import User from '../../models/user/User';

const localAccountKey = 'localAccount';

export const getLocalAccount = () => {
  const userJSON = localStorage.getItem(localAccountKey);

  if (!userJSON) {
    return undefined;
  }

  return JSON.parse(userJSON) as User;
};

export const setLocalAccount = (user: User) => {
  const userJSON = JSON.stringify(user);

  localStorage.setItem(localAccountKey, userJSON);
};

export const removeLocalAccount = () => {
  localStorage.removeItem(localAccountKey);
};

export const getAvatarString = (user: User) => {
  if (user.name === '') {
    return '-';
  }

  const idx = user.name.lastIndexOf(' ') || 0;

  return user.name.charAt(idx + 1).toUpperCase();
};
