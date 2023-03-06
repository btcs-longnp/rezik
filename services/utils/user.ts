import User from '../../models/user/User'

export const getAvatarString = (user: User) => {
  if (user.name === '') {
    return '-'
  }

  const idx = user.name.lastIndexOf(' ') || 0

  return user.name.charAt(idx + 1).toUpperCase()
}
