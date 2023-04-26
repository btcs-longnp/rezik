import { AsyncMqttClient, connectAsync } from 'async-mqtt'
import { useEffect, useRef } from 'react'
import Message from '../../models/message/Message'
import { emitAddReaction } from '../emitter/reactionEmitter'
import { ReactionType, allowReactions } from '../../models/Reaction'
import { nanoid } from 'nanoid'

const useSnapshotRoom = (roomId: string | undefined) => {
  const mqttClient = useRef<AsyncMqttClient | undefined>()

  useEffect(() => {
    if (!roomId) {
      return
    }

    const clientId = nanoid()
    const topic = `/rooms/${roomId}/messages`

    async function setupMQTT() {
      try {
        const client = await connectAsync('ws://127.0.0.1:15675/ws', {
          username: 'guest',
          password: 'guest',
          clientId,
          clean: false,
        })

        console.log('MQTT connected')

        if (mqttClient.current) {
          await mqttClient.current.end()
        }

        mqttClient.current = client

        await client.subscribe(topic, { qos: 1 })
        client.on('message', (t, m) => {
          const raw = JSON.parse(m.toString())
          const msg: Message = {
            id: raw.i,
            roomID: raw.r,
            senderID: raw.s,
            body: raw.b,
            timestamp: new Date(raw.t),
          }

          if (
            msg.body.startsWith('[@reaction]') &&
            allowReactions.includes(msg.body.slice(11))
          ) {
            emitAddReaction({
              id: msg.id,
              type: msg.body.slice(11) as ReactionType,
            })
          }
        })
      } catch (e) {
        console.log((e as Error).message)
      }
    }

    setupMQTT()

    return () => {
      if (mqttClient.current) {
        mqttClient.current.end()
      }
    }
  }, [roomId])
}

export default useSnapshotRoom
