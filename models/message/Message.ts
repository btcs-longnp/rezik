export default interface Message {
  id: string
  roomID: number
  senderID: number
  body: string
  timestamp: Date
}
