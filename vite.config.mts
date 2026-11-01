import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';

export default defineConfig(({ command }) => ({
  plugins: [reactRouter()],
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 4/5 still use @import
        silenceDeprecations: ['import', 'legacy-js-api', 'global-builtin', 'color-functions'],
        quietDeps: true,
      },
    },
  },
  build: {
    sourcemap: true,
  },
  ssr: {
    // The production build bundles every dependency into the server build, as the deployed function expects. (Several, litform
    // among them, can't be loaded by Node as-is because they rely on bundler-style module resolution; in development they go
    // through Vite for the same reason, and everything else is loaded from node_modules as usual.)
    noExternal: command === 'build' ? true : [/^@neinteractiveliterature\//],
  },
  server: {
    port: 3042,
  },
}));
