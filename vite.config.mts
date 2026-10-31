import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ruby from 'vite-plugin-ruby';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    ruby(),
    // @aws-sdk/lib-storage pulls in stream-browserify/readable-stream, which expect Node's `global`, `process` and
    // `Buffer`. Webpack shimmed these automatically; Vite doesn't.
    nodePolyfills(),
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
    sourcemap: true,
  },
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      // ASSETS_HOST is only known at runtime (it's a Fly env var, not a build arg), so lazy-loaded chunk URLs
      // are resolved in the browser from window.larpLibraryAssetsHost, as setPublicPath.ts used to do.
      if (command === 'build' && hostType === 'js') {
        return {
          runtime: `((window.larpLibraryAssetsHost ? '//' + window.larpLibraryAssetsHost : '') + '/packs/' + ${JSON.stringify(filename)})`,
        };
      }
      return undefined;
    },
  },
}));
