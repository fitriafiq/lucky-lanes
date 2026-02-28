<template>
	<div class="space-y-8 max-w-7xl mx-auto">
		<header class="text-center space-y-2">
			<h1 class="text-5xl font-black bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
				LUCKY LANES
			</h1>
			<p class="text-slate-400 uppercase tracking-widest text-sm font-semibold">The Ultimate Suit Race</p>
		</header>

		<div v-if="state.status === 'setup'"
			class="flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-500">
			<UCard class="w-full max-w-2xl bg-slate-800/50 border-slate-700 backdrop-blur-xl">
				<template #header>
					<div class="flex items-center justify-between">
						<h2 class="text-xl font-bold">Player Selection</h2>
						<UBadge color="teal" variant="soft">Human Players</UBadge>
					</div>
				</template>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
					<div v-for="player in state.players.filter(p => p.type === 'human')" :key="player.id"
						class="space-y-4">
						<label class="block text-sm font-medium text-slate-400">{{ player.name }}</label>
						<div class="grid grid-cols-2 gap-2">
							<button v-for="suit in suits" :key="suit" @click="selections[player.id!] = suit"
								:disabled="Object.values(selections).includes(suit) && selections[player.id!] !== suit"
								class="flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200"
								:class="[
									selections[player.id!] === suit
										? 'border-teal-500 bg-teal-500/20 text-teal-400'
										: 'border-slate-700 bg-slate-800 hover:border-slate-600 grayscale opacity-50',
									Object.values(selections).includes(suit) && selections[player.id!] !== suit ? 'cursor-not-allowed hidden' : ''
								]">
								<UIcon :name="betterIcons[suit]" class="w-8 h-8 mb-2" :class="suitColor(suit)" />
								<span class="text-xs capitalize font-bold">{{ suit }}</span>
							</button>
						</div>
					</div>
				</div>

				<template #footer>
					<div class="flex items-center justify-between">
						<p class="text-xs text-slate-500 italic">Remaining suit will be assigned to the Computer
							Sabotager.</p>
						<UButton color="teal" size="lg" block :disabled="!canStart" @click="handleStart"
							class="max-w-[200px]">
							Start Race
						</UButton>
					</div>
				</template>
			</UCard>
		</div>

		<div v-else class="grid grid-cols-1 lg:grid-cols-6 gap-6">

			<div class="lg:col-span-1 space-y-4 order-2 lg:order-1">
				<UCard class="bg-slate-800/30 border-slate-700">
					<div class="flex items-center justify-between mb-4">
						<h3 class="font-bold text-slate-400 uppercase text-xs">Race Logs</h3>
						<UIcon name="ph:scroll-fill" class="text-slate-500" />
					</div>
					<div class="h-[460px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
						<div v-for="(log, i) in state.history" :key="i"
							class="text-sm p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 animate-in slide-in-from-left duration-300"
							:class="i === 0 ? 'border-teal-500/30 bg-teal-500/5 text-teal-100 font-medium' : 'text-slate-400'">
							{{ log }}
						</div>
					</div>
				</UCard>
			</div>

			<div class="lg:col-span-4 space-y-6 order-1 lg:order-2">
				<div class="bg-slate-900 border border-slate-700 rounded-2xl p-6 relative overflow-hidden">
					<div class="absolute inset-0 grid grid-cols-6 pointer-events-none">
						<div v-for="i in 6" :key="i"
							class="border-r border-slate-800/50 last:border-0 h-full flex items-end justify-center pb-2 text-[10px] font-bold text-slate-700">
							{{ i === 1 ? 'START' : (i === 6 ? 'FINISH' : 'S' + (i - 1)) }}
						</div>
					</div>

					<div class="space-y-4 relative z-10">
						<div v-for="suit in suits" :key="suit" class="h-24 flex items-center relative">
							<div class="absolute left-0 right-0 h-1 bg-slate-800 rounded-full"></div>

							<div class="absolute transition-all duration-700 ease-in-out -translate-x-1/2"
								:style="{ left: `${((state.positions[suit] + 0.5) / 6) * 100}%` }">
								<div class="flex flex-col items-center">
									<UCard
										class="w-14 h-[72px] flex items-center justify-center p-0 rounded-xl shadow-2xl transition-transform hover:scale-110 active:scale-95 cursor-default"
										:class="suitBg(suit)">
										<UIcon :name="betterIcons[suit]" class="w-9 h-9" :class="suitColor(suit)" />
									</UCard>

									<span class="mt-1 text-[9px] font-bold uppercase tracking-tight whitespace-nowrap"
										:class="state.players.find(p => p.suit === suit)?.type === 'computer' ? 'text-orange-400' : 'text-slate-400'">
										{{ getSuitLabel(suit) }}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="grid grid-cols-6 gap-4">
					<div class="col-span-1 invisible"></div>
					<div v-for="(penalty, idx) in 4" :key="idx" class="flex flex-col items-center space-y-2">
						<div class="w-12 h-16 rounded-lg border-2 border-dashed transition-all duration-500 flex items-center justify-center"
							:class="state.revealedPenalties[idx]
								? 'border-orange-500 bg-orange-500/10 scale-100 rotate-0'
								: 'border-slate-700 bg-slate-800/50 scale-90 opacity-40'">
							<UIcon v-if="state.revealedPenalties[idx]" :name="betterIcons[state.penaltyCards[idx].suit]"
								class="w-6 h-6" :class="suitColor(state.penaltyCards[idx].suit)" />
							<UIcon v-else name="ph:warning-circle-bold" class="w-4 h-4 text-slate-600" />
						</div>
						<span class="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Penalty C{{ idx + 1
						}}</span>
					</div>
					<div class="col-span-1 invisible"></div>
				</div>

			</div>

			<div class="lg:col-span-1 order-3 flex flex-col items-center space-y-6">
				<div class="flex flex-col items-center">
					<span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Last Drawn</span>
					<div v-if="state.lastCard"
						class="relative w-[72px] h-[100px] rounded-lg shadow-xl overflow-hidden animate-in zoom-in duration-300 select-none"
						:class="(state.lastCard.suit === 'hearts' || state.lastCard.suit === 'diamonds')
							? 'bg-gradient-to-br from-white to-red-50 border-2 border-red-200'
							: 'bg-gradient-to-br from-white to-slate-100 border-2 border-slate-300'">
						<div class="absolute top-1.5 left-1.5 flex flex-col items-center leading-none">
							<span class="text-sm font-black"
								:class="(state.lastCard.suit === 'hearts' || state.lastCard.suit === 'diamonds') ? 'text-red-600' : 'text-slate-800'">
								{{ state.lastCard.rank }}
							</span>
							<UIcon :name="betterIcons[state.lastCard.suit]" class="w-3 h-3"
								:class="cardSuitColor(state.lastCard.suit)" />
						</div>
						<div class="absolute bottom-1.5 right-1.5 flex flex-col items-center leading-none rotate-180">
							<span class="text-sm font-black"
								:class="(state.lastCard.suit === 'hearts' || state.lastCard.suit === 'diamonds') ? 'text-red-600' : 'text-slate-800'">
								{{ state.lastCard.rank }}
							</span>
							<UIcon :name="betterIcons[state.lastCard.suit]" class="w-3 h-3"
								:class="cardSuitColor(state.lastCard.suit)" />
						</div>
						<div class="absolute inset-0 flex items-center justify-center">
							<UIcon :name="betterIcons[state.lastCard.suit]" class="w-10 h-10 opacity-90"
								:class="cardSuitColor(state.lastCard.suit)" />
						</div>
					</div>
					<div v-else
						class="w-[72px] h-[100px] rounded-lg border-2 border-slate-700 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg">
						<div
							class="w-[56px] h-[84px] rounded border border-slate-600 bg-slate-700/50 flex items-center justify-center">
							<UIcon name="ph:question-fill" class="w-6 h-6 text-slate-500" />
						</div>
					</div>
				</div>

				<div class="flex flex-col items-center">
					<span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Deck</span>
					<div
						class="relative w-[72px] h-[100px] rounded-lg border-2 border-teal-700/50 bg-gradient-to-br from-teal-900 to-slate-900 flex items-center justify-center shadow-lg">
						<div
							class="w-[56px] h-[84px] rounded border border-teal-600/30 bg-teal-800/20 flex items-center justify-center">
							<span class="text-2xl font-black text-teal-400">{{ state.deck.length }}</span>
						</div>
					</div>
				</div>

				<UButton size="xl" color="teal" icon="ph:cursor-click-fill"
					:loading="state.isDrawing || !!state.activeChoice" :disabled="state.status !== 'playing'" block
					@click="drawCard" class="w-full py-5 text-lg font-black rounded-2xl shadow-xl shadow-teal-500/20">
					DRAW
				</UButton>
			</div>

		</div>

		<UModal :model-value="!!state.winner" prevent-close>
			<UCard v-if="state.winner" class="bg-slate-800 border-teal-500/50">
				<div class="text-center py-8 space-y-6">
					<div class="inline-flex p-6 rounded-full bg-teal-500/10 text-teal-500 mx-auto">
						<UIcon :name="betterIcons[state.winner]" class="w-16 h-16" />
					</div>
					<div class="space-y-2">
						<h2 class="text-4xl font-black text-white capitalize">{{ state.winner }} WINS!</h2>
						<p class="text-slate-400">The race has concluded. {{ getSuitLabel(state.winner) }} is the
							champion.</p>
					</div>
					<UButton color="teal" block size="lg" @click="state.status = 'setup'; state.winner = null">Play
						Again
					</UButton>
				</div>
			</UCard>
		</UModal>

		<USlideover :model-value="!!state.activeChoice" prevent-close :ui="{ width: 'max-w-sm' }">
			<div class="h-full bg-slate-900 border-l border-purple-500/30 flex flex-col">
				<div class="p-8 flex-1 flex flex-col">
					<div class="mb-10 space-y-2">
						<h2 class="text-3xl font-black text-white italic tracking-tight">FATE'S CHOICE</h2>
						<p class="text-slate-400 text-sm">
							Choose your path, {{state.players.find(p => p.id === state.activeChoice?.playerId)?.name
							}}.
							Your decision will influence the race.
						</p>
					</div>

					<div v-if="state.activeChoice" class="space-y-6 flex-1 flex flex-col justify-center">
						<div v-for="optIdx in state.activeChoice.options" :key="optIdx"
							@click="handleSelectChoice(optIdx)"
							class="group relative cursor-pointer overflow-hidden p-6 rounded-2xl border-2 border-slate-700 bg-slate-800/50 hover:border-purple-500 hover:bg-purple-500/5 transition-all duration-300">

							<div
								class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
							</div>

							<div class="relative flex items-center space-x-6">
								<div
									class="p-4 rounded-xl bg-slate-900 shadow-inner group-hover:scale-110 transition-transform duration-300">
									<UIcon :name="ROULETTE_OPTIONS[optIdx].icon"
										:class="['w-10 h-10', ROULETTE_OPTIONS[optIdx].color]" />
								</div>
								<div class="flex-1">
									<h3 class="text-xl font-black text-white uppercase tracking-tight">
										{{ getChoiceLabel(optIdx, state.activeChoice!.playerId) }}
									</h3>
									<p class="text-slate-400 text-xs font-medium">
										{{ ROULETTE_OPTIONS[optIdx].description }}
									</p>
									<p
										class="text-purple-500 text-[10px] mt-2 font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
										Apply Effect
									</p>
								</div>
								<UIcon name="ph:caret-right-bold"
									class="text-slate-700 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
							</div>
						</div>
					</div>

					<div class="mt-auto pt-8 border-t border-slate-800">
						<div
							class="flex items-center space-x-3 text-purple-400/60 font-medium text-xs uppercase tracking-widest">
							<UIcon name="ph:activity-fill" class="animate-pulse" />
							<span>Strategic decision phase</span>
						</div>
					</div>
				</div>
			</div>
		</USlideover>

	</div>
</template>

<script setup lang="ts">
const { state, suits, betterIcons, startGame, drawCard, resolveChoice, getChoiceLabel } = useGame()

const selections = ref<Record<string, Suit | null>>({
	'1': null,
	'2': null,
	'3': null
})

const availableSuits = computed(() => {
	const chosen = Object.values(selections.value).filter(Boolean) as Suit[]
	return suits.filter((s: Suit) => !chosen.includes(s))
})

const canStart = computed(() => {
	return selections.value['1'] && selections.value['2'] && selections.value['3']
})

const handleStart = () => {
	if (canStart.value) {
		startGame(selections.value as Record<string, Suit>)
	}
}

const suitColor = (suit: Suit) => {
	if (suit === 'hearts' || suit === 'diamonds') return 'text-red-500'
	return 'text-slate-200'
}

const cardSuitColor = (suit: Suit) => {
	if (suit === 'hearts' || suit === 'diamonds') return 'text-red-600'
	return 'text-slate-900'
}

const suitBg = (suit: Suit) => {
	if (suit === 'hearts' || suit === 'diamonds') return 'bg-red-500/10 border-red-500/20'
	return 'bg-slate-500/10 border-slate-500/20'
}

const getSuitLabel = (suit: Suit) => {
	const player = state.players.find((p: any) => p.suit === suit)
	if (!player) return ''
	return player.type === 'computer' ? 'COMPUTER' : player.name
}

const handleSelectChoice = (idx: number) => {
	resolveChoice(idx)
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
	background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
	background: #334155;
	border-radius: 99px;
}
</style>
