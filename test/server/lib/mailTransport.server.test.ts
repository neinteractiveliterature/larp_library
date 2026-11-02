// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { createMailTransport } from '~/.server/lib/mailTransport.server';

// Uses nodemailer's own stream transport as a stand-in for a real SMTP server, by letting the transport's `compile`
// plugins run against it.
describe('createMailTransport', () => {
  it('redirects every message to the override recipient and records who it was for', async () => {
    const transport = createMailTransport({
      awsRegion: 'us-east-1',
      smtpUrl: 'smtp://localhost:1',
      emailOverrideRecipient: 'inbox@example.com',
    });

    const sent = await new Promise<{ to?: unknown; cc?: unknown; subject?: unknown }>((resolve) => {
      transport.use('stream', (mail, callback) => {
        resolve(mail.data);
        callback(new Error('stop before connecting'));
      });
      transport
        .sendMail({ to: 'real@example.com', cc: 'other@example.com', subject: 'Hello', text: 'hi' })
        .catch(() => {});
    });

    expect(sent.to).toBe('inbox@example.com');
    expect(sent.cc).toBeUndefined();
    expect(sent.subject).toBe('[to: real@example.com] Hello');
  });
});
