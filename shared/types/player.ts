import type { Suit } from './card'

export type PlayerType = 'human' | 'computer'

export interface Player {
	id: string
	name: string
	type: PlayerType
	suit: Suit | null
}
