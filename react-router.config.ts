import type { Config } from '@react-router/dev/config';

// Framework mode as a static single-page app: `react-router build` writes an index.html shell plus hashed assets to
// build/client, and Rails serves the shell for every page URL (see SinglePageAppController).
export default {
  appDirectory: 'app/javascript',
  buildDirectory: 'build',
  ssr: false,
} satisfies Config;
