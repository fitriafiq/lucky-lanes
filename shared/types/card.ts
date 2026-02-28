export type Suit = 'hearts' | 'spades' | 'clubs' | 'diamonds'

export interface Card {
	suit: Suit
	rank: string | number
}
