interface User {
  id: string
  name: string
}

export const newUser = (id: string, name: string): User => {
  return {
    id,
    name,
  }
}

const anonymousUserId = 'NskKXKnVXDArA3DwhOPLe'

export const getAnonymousUser = () => {
  return newUser(anonymousUserId, 'Cáo Ẩn Danh')
}

export const isAnonymousUser = (user: User) => user.id === anonymousUserId

export default User
