import axios from 'axios'

export interface SendReactionRequest {
  senderId: number
  roomId: string
  body: string
}

export const sendReaction = async (request: SendReactionRequest) => {
  const url = 'http://localhost:8080/v1/messages'

  await axios.post(url, {
    s: request.senderId,
    r: request.roomId,
    b: `[@reaction]${request.body}`,
  })
}
