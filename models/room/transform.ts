import { Room, RoomPublic } from './Room'

export const toRoomPublic = (room: Room): RoomPublic => {
  return {
    id: room.id,
    name: room.name,
    coverUrl: room.coverUrl,
    description: room.description,
  }
}
