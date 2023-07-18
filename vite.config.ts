import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';
import react from '@vitejs/plugin-react-swc';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import eslint from 'vite-plugin-eslint';

const viteEnv = {}
Object.keys(process.env).forEach((key) => {
  if (key.startsWith(`VITE_`)) {
    viteEnv[`import.meta.env.${key}`] = process.env[key]
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  define: viteEnv,
  build: {
    outDir: 'build',
  },
  plugins: [
    react(), 
    viteTsconfigPaths(),
    svgrPlugin(),
    eslint(),
    checker({
      typescript: true
    })
  ],
});