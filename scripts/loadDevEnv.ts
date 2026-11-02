import { config } from 'dotenv';

// Loads the env files for the command-line tools (drizzle-kit and the scripts), the same ones in the same order of precedence
// as Vite loads for `yarn start`. A variable that's already set in the environment is never overridden, so running a tool with
// `DATABASE_URL=... yarn ...` (as the cutover runbook does for production) uses that URL whatever the files say.
config({ path: ['.env.development.local', '.env.local', '.env.development', '.env'], quiet: true });
