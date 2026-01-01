import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

export default defineConfig({
	plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './tests/setup.ts',
	},
});
