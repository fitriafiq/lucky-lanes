import type { Suit, Card } from '~/shared/types/card'
import type { Player } from '~/shared/types/player'
import { ROULETTE_OPTIONS } from '~/shared/constants'

export const useGame = () => {
	const suits: Suit[] = ['hearts', 'spades', 'clubs', 'diamonds']

	const betterIcons: Record<Suit, string> = {
		hearts: 'ph:heart-fill',
		spades: 'ph:spade-fill',
		clubs: 'ph:club-fill',
		diamonds: 'ph:diamond-fill'
	}

	const state = reactive({
		status: 'setup' as 'setup' | 'playing' | 'game_over',
		players: [
			{ id: '1', name: 'Player 1', type: 'human', suit: null },
			{ id: '2', name: 'Player 2', type: 'human', suit: null },
			{ id: '3', name: 'Player 3', type: 'human', suit: null },
			{ id: '4', name: 'Sabotager', type: 'computer', suit: null }
		] as Player[],
		positions: {
			hearts: 0,
			spades: 0,
			clubs: 0,
			diamonds: 0
		} as Record<Suit, number>,
		deck: [] as Card[],
		lastCard: null as Card | null,
		penaltyCards: [] as Card[], // Indices 0-3 correspond to columns 1-4
		revealedPenalties: [] as boolean[],
		rouletteHistory: new Set<string>(),
		winner: null as Suit | null,
		history: [] as string[],
		isDrawing: false,
		activeChoice: null as { playerId: string, options: number[] } | null
	})

	const trackLength = 5
	const halfwayPoint = 3

	const getPlayerBySuit = (suit: Suit) => {
		return state.players.find(p => p.suit === suit)
	}

	const shuffle = (array: any[]) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array
	}

	const initDeck = () => {
		const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K']
		const newDeck: Card[] = []
		suits.forEach(suit => {
			ranks.forEach(rank => {
				newDeck.push({ suit, rank })
			})
		})
		return shuffle(newDeck)
	}

	const startGame = (playerSuits: Record<string, Suit>) => {
		// Assign suits
		state.players.forEach(p => {
			p.suit = playerSuits[p.id]
		})

		// Assign computer suit (the one left over)
		const assignedSuits = Object.values(playerSuits)
		const computerSuit = suits.find(s => !assignedSuits.includes(s))!
		state.players.find(p => p.type === 'computer')!.suit = computerSuit

		// Reset state
		state.positions = { hearts: 0, spades: 0, clubs: 0, diamonds: 0 }
		state.deck = initDeck()
		state.penaltyCards = shuffle(initDeck()).slice(0, 4) // 4 penalty cards for columns 1, 2, 3, 4
		state.revealedPenalties = [false, false, false, false]
		state.rouletteHistory.clear()
		state.lastCard = null
		state.winner = null
		state.history = ['Game started! Good luck.']
		state.status = 'playing'
	}

	const moveSuit = (suit: Suit, spaces: number) => {
		const newPos = Math.max(0, Math.min(trackLength, state.positions[suit] + spaces))
		state.positions[suit] = newPos

		if (newPos >= trackLength) {
			state.winner = suit
			state.status = 'game_over'
			state.history.unshift(`${suit.toUpperCase()} wins!`)
		}
		return newPos
	}

	const triggerPenalty = (columnIdx: number) => {
		state.revealedPenalties[columnIdx] = true
		const penaltyCard = state.penaltyCards[columnIdx]
		state.history.unshift(`Penalty Card Revealed: ${penaltyCard.rank} of ${penaltyCard.suit}`)

		// The suit on the penalty card moves BACK 1
		moveSuit(penaltyCard.suit, -1)
		state.history.unshift(`${penaltyCard.suit.toUpperCase()} moved back 1 space!`)
	}

	const triggerChoice = (playerId: string) => {
		if (state.rouletteHistory.has(playerId)) return

		state.rouletteHistory.add(playerId)

		// Pick 2 unique random indices from ROULETTE_OPTIONS
		const allIndices = ROULETTE_OPTIONS.map((_, i) => i)
		const shuffled = shuffle([...allIndices])
		const options = shuffled.slice(0, 2)

		state.activeChoice = { playerId, options }
	}

	const resolveChoice = (optionIndex: number) => {
		if (!state.activeChoice) return

		const effect = ROULETTE_OPTIONS[optionIndex].id
		const player = state.players.find(p => p.id === state.activeChoice?.playerId)!

		state.activeChoice = null

		switch (effect) {
			case 'move_self_forward':
				moveSuit(player.suit!, 1)
				state.history.unshift(`Choice: ${player.name} surged forward!`)
				break

			case 'move_others_backward':
				state.players.forEach(p => {
					if (p.id !== player.id && p.suit) moveSuit(p.suit, -1)
				})
				state.history.unshift(`Choice: ${player.name} sent a Seismic Wave! Everyone back 1.`)
				break
			case 'sabotage_random':
				const otherSuits = suits.filter(s => s !== player.suit)
				const randomSuit = otherSuits[Math.floor(Math.random() * otherSuits.length)]
				moveSuit(randomSuit, -1)
				state.history.unshift(`Choice: ${player.name} sabotaged ${randomSuit.toUpperCase()}!`)
				break
			case 'do_nothing':
				state.history.unshift(`Choice: ${player.name} let fate rest. Nothing happened.`)
				break
		}
	}

	const getChoiceLabel = (optIdx: number, playerId: string) => {
		const opt = ROULETTE_OPTIONS[optIdx]
		const player = state.players.find(p => p.id === playerId)
		if (!player) return opt.label

		if (opt.id === 'move_self_forward') return `Sprint (${player.suit?.toUpperCase()})`
		return opt.label
	}

	const drawCard = async () => {
		if (state.status !== 'playing' || state.deck.length === 0 || state.isDrawing || state.activeChoice) return

		state.isDrawing = true

		// Small delay for visual effect
		await new Promise(r => setTimeout(r, 600))

		const card = state.deck.shift()!
		state.lastCard = card

		const suit = card.suit
		const newPos = moveSuit(suit, 1)

		state.history.unshift(`Drawn: ${card.rank} of ${card.suit}`)

		// Computer Sabotager Rule
		const computerPlayer = state.players.find(p => p.type === 'computer')!
		if (suit === computerPlayer.suit) {
			const columnTriggered = newPos - 1
			if (columnTriggered >= 0 && columnTriggered < 4 && !state.revealedPenalties[columnTriggered]) {
				triggerPenalty(columnTriggered)
			}
		}

		// Halfway Roulette Rule
		const player = getPlayerBySuit(suit)
		if (player && player.type === 'human' && newPos === halfwayPoint && !state.rouletteHistory.has(player.id)) {
			triggerChoice(player.id)
		}

		state.isDrawing = false
	}

	return {
		state,
		suits,
		betterIcons,
		startGame,
		drawCard,
		resolveChoice,
		getChoiceLabel
	}
}
