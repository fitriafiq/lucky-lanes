export const ROULETTE_OPTIONS = [
	{ id: 'move_self_forward', label: 'Sprint Forward', icon: 'ph:rocket-launch-fill', color: 'text-green-400', description: 'Advance your racer 1 space' },
	{ id: 'sabotage_random', label: 'Sabotage', icon: 'ph:bomb-fill', color: 'text-orange-400', description: 'Push a random opponent back 1' },
	{ id: 'move_others_backward', label: 'Seismic Wave', icon: 'ph:waves-fill', color: 'text-pink-400', description: 'All opponents move back 1' },
	{ id: 'do_nothing', label: 'Play It Safe', icon: 'ph:shield-chevron-fill', color: 'text-slate-400', description: 'No effect — skip your turn' }
] as const
