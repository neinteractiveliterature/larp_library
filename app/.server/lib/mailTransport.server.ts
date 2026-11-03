import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2';
import { createTransport, type SendMailOptions, type Transporter } from 'nodemailer';

export type MailTransportConfig = {
  smtpUrl?: string;
  awsRegion: string;
  emailOverrideRecipient?: string;
};

function formatAddress(address: SendMailOptions['to']): string {
  if (!address) return '';
  if (Array.isArray(address)) return address.map(formatAddress).join(', ');
  return typeof address === 'string' ? address : (address.address ?? '');
}

function formatRecipients(to: SendMailOptions['to']): string {
  if (!to) return '(no recipient)';
  return Array.isArray(to) ? to.map(formatAddress).join(', ') : formatAddress(to);
}

/**
 * Builds a nodemailer transport from plain config values rather than reading the environment directly, so it can be
 * unit-tested with arbitrary config; mail.server.ts is the one caller, passing `env.*`.
 */
export function createMailTransport(config: MailTransportConfig): Transporter {
  // Local development points SMTP_URL at a local SMTP catcher (e.g. Mailpit) so email never leaves the machine;
  // deployed environments send through SES.
  const transport = config.smtpUrl
    ? createTransport({ url: config.smtpUrl })
    : createTransport({ SES: { sesClient: new SESv2Client({ region: config.awsRegion }), SendEmailCommand } });

  // A non-production stage can really send through SES but redirect every message to a single inbox, so deliverability
  // can be checked without emailing actual users.
  if (config.emailOverrideRecipient) {
    const overrideRecipient = config.emailOverrideRecipient;
    transport.use('compile', (mail, callback) => {
      mail.data.subject = `[to: ${formatRecipients(mail.data.to)}] ${mail.data.subject ?? ''}`;
      mail.data.to = overrideRecipient;
      delete mail.data.cc;
      delete mail.data.bcc;
      callback();
    });
  }

  return transport;
}
