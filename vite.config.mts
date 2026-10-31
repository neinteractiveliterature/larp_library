import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ruby from 'vite-plugin-ruby';

export default defineConfig(({ command }) => ({
  plugins: [react(), ruby()],
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
