export const allowReactions = [
  'haha',
  'heart',
  'sad',
  'angry',
  'surprise',
  'wry',
]

export type ReactionType =
  | 'haha'
  | 'heart'
  | 'sad'
  | 'angry'
  | 'surprise'
  | 'wry'

interface Reaction {
  id: string
  type: ReactionType
  arrivedAt: number
}

export default Reaction
