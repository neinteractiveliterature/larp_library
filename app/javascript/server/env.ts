import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  AWS_S3_BUCKET: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),
  // The public origin of the app, for absolute links in emails
  APP_URL_BASE: z.string(),
  // Local development sends mail to a local SMTP catcher (e.g. Mailpit) instead of SES
  SMTP_URL: z.string().optional(),
  // Redirects every outgoing email to one inbox, for non-production stages that really send through SES
  EMAIL_OVERRIDE_RECIPIENT: z.string().optional(),
  BETTER_AUTH_SECRET: z.string(),
  // Intercode is the only sign-in provider. INTERCODE_URL is the origin of the Intercode instance (e.g.
  // https://www.neilhosting.net); the app id and secret are this app's registered OAuth application there.
  INTERCODE_URL: z.string(),
  INTERCODE_APP_ID: z.string(),
  INTERCODE_APP_SECRET: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
});

export const env = envSchema.parse(process.env);
