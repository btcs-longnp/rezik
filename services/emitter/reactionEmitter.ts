import EventEmitter from 'events'
import { ReactionType } from '../../models/Reaction'

const reactionEmitter = new EventEmitter()

export enum ReactionEmitEvent {
  addReaction = 'addReaction',
}

export const emitAddReaction = (data: { id: string; type: ReactionType }) => {
  reactionEmitter.emit(ReactionEmitEvent.addReaction, data)
}

export const listenAddReaction = (
  handler: (data: { id: string; type: ReactionType }) => void
) => {
  reactionEmitter.on(ReactionEmitEvent.addReaction, handler)

  return () => {
    reactionEmitter.removeListener(ReactionEmitEvent.addReaction, handler)
  }
}

export default reactionEmitter
