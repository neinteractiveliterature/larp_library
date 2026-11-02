import type { ReactElement } from 'react';
import type { SendMailOptions, Transporter } from 'nodemailer';
import { renderEmail } from '~/.server/emails/render';

const DEFAULT_FROM = 'Larp Library <noreply@larplibrary.org>';

export type SendTemplatedMailOptions = {
  // A Pick, not the full Transporter, so the app-wide singleton and the small fake transports tests pass in satisfy the
  // same type.
  transport: Pick<Transporter, 'sendMail'>;
  to: SendMailOptions['to'];
  cc?: SendMailOptions['cc'];
  from?: string;
  replyTo?: SendMailOptions['replyTo'];
  subject: string;
  element: ReactElement;
};

export async function sendTemplatedMail({
  transport,
  to,
  cc,
  from = DEFAULT_FROM,
  replyTo,
  subject,
  element,
}: SendTemplatedMailOptions): Promise<void> {
  const { html, text } = await renderEmail(element);
  await transport.sendMail({ from, to, cc, replyTo, subject, html, text });
}
