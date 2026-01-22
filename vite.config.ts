import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
	plugins: [svelte()],
	root: 'src/frontend',
	build: {
		outDir: '../../public',
		emptyOutDir: true,
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'src/frontend/index.html'),
			},
		},
	},
	server: {
		port: 5173,
		strictPort: false,
		open: false,
	},
});
