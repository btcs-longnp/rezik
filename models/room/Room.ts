export interface Room {
  id: string
  name: string
  coverUrl: string
  description: string
}

export type RoomPublic = Pick<Room, 'id' | 'name' | 'coverUrl' | 'description'>
