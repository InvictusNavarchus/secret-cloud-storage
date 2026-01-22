import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
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
