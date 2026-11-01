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
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
});

export const env = envSchema.parse(process.env);
