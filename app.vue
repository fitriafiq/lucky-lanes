<template>
	<div class="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-teal-500/30 flex flex-col">
		<main class="flex-1">
			<UContainer class="py-8">
				<NuxtPage />
			</UContainer>
		</main>

		<footer class="py-6 text-center text-slate-500 text-sm mt-auto border-t border-slate-800/50">
			<p>
				Built by <a href="https://fitriafiq.com" target="_blank" rel="noopener noreferrer"
					class="text-teal-500 hover:text-teal-400 font-medium transition-colors">Fitri</a>
			</p>
		</footer>

		<UNotifications />
	</div>
</template>

<style>
body {
	margin: 0;
	background-color: #0f172a;
}
</style>
