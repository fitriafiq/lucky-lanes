export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: ['@nuxt/ui'],
	colorMode: {
		preference: 'dark'
	},
	imports: {
		dirs: ['shared']
	},
	compatibilityDate: '2024-04-03'
})
