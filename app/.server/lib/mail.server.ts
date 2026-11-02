import type { Transporter } from 'nodemailer';
import { env } from '~/.server/env';
import { createMailTransport } from '~/.server/lib/mailTransport.server';

export const mailTransport: Transporter = createMailTransport({
  smtpUrl: env.SMTP_URL,
  awsRegion: env.AWS_REGION,
  emailOverrideRecipient: env.EMAIL_OVERRIDE_RECIPIENT,
});
