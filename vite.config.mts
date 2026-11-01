import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// In development, this Vite server is what you open in the browser: it serves the app shell and proxies the paths that
// belong to Rails.
const railsUrl = process.env['RAILS_URL'] ?? 'http://localhost:3000';
const railsPaths = ['/graphql', '/graphiql', '/app_config', '/users', '/uploads', '/rails'];

export default defineConfig(({ command }) => ({
  // In production Rails serves the built files from public/packs (see bin/build-frontend)
  base: command === 'build' ? '/packs/' : '/',
  plugins: [
    reactRouter(),
    // @aws-sdk/lib-storage pulls in stream-browserify/readable-stream, which expect Node's `global`, `process` and
    // `Buffer`. Webpack shimmed these automatically; Vite doesn't.  (Only the browser bundle needs them: the build also
    // runs the app in Node to generate the HTML shell, where these modules should be Node's own.)
    { ...nodePolyfills(), applyToEnvironment: (environment) => environment.name === 'client' },
  ],
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
    // Rails serves the files in public/ itself; only the build's own output belongs in public/packs
    copyPublicDir: false,
    sourcemap: true,
  },
  ssr: {
    // (Production build only; the dev server loads dependencies from node_modules as usual)
    // The server build only runs at build time, to generate the HTML shell.  Bundle every dependency into it: several
    // (Apollo Client, litform) can't be loaded by Node as-is because they rely on bundler-style module resolution.
    noExternal: command === 'build' ? true : [/^@apollo\//, /^@neinteractiveliterature\//],
  },
  server: {
    port: 3042,
    proxy: Object.fromEntries(railsPaths.map((path) => [path, { target: railsUrl, changeOrigin: false }])),
  },
}));
