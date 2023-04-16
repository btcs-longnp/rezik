import { Room } from '../../models/room/Room'

const rooms: Record<string, Room> = {
  'btc-studio': {
    name: 'BTC Studio',
    coverUrl:
      'https://images.unsplash.com/photo-1621221815245-6e9039a6ff3c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    id: 'btc-studio',
    description: '',
  },
  isling: {
    name: 'isling',
    coverUrl:
      'https://images.unsplash.com/photo-1468853692559-fc594e932a2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    id: 'isling',
    description: 'isling and friends :>',
  },
  chill: {
    name: 'Chill',
    coverUrl:
      'https://images.unsplash.com/photo-1531574373289-ad0d66e39ba9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    id: 'chill',
    description: "Don't take things too seriously, and just chill",
  },
  sleep: {
    name: 'Sleep',
    coverUrl:
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    id: 'sleep',
    description: '',
  },
  'pub-music': {
    name: 'Pub Bar Music',
    coverUrl:
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    id: 'pub-music',
    description: '',
  },
  baroque: {
    name: 'Baroque',
    coverUrl:
      'https://images.unsplash.com/photo-1491566102020-21838225c3c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    id: 'baroque',
    description: '',
  },
}

export const getForYouRooms = () => {
  return Object.values(rooms)
}

export const getRoomById = (id: string) => rooms[id]
