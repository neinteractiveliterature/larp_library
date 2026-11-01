const { init, setUser } = vi.hoisted(() => ({ init: vi.fn(), setUser: vi.fn() }));
vi.mock('@sentry/browser', () => ({ init, setUser }));

import { initSentry } from './initSentry';

describe('initSentry', () => {
  beforeEach(() => {
    init.mockClear();
    setUser.mockClear();
  });

  it('does nothing when no DSN is configured', () => {
    initSentry(null, 42);
    initSentry(undefined);
    initSentry('');

    expect(init).not.toHaveBeenCalled();
    expect(setUser).not.toHaveBeenCalled();
  });

  it('starts Sentry with the configured DSN', () => {
    initSentry('https://key@example.ingest.sentry.io/123', null);

    expect(init).toHaveBeenCalledWith({ dsn: 'https://key@example.ingest.sentry.io/123' });
    expect(setUser).not.toHaveBeenCalled();
  });

  it('tags errors with the signed-in user', () => {
    initSentry('https://key@example.ingest.sentry.io/123', 42);

    expect(setUser).toHaveBeenCalledWith({ id: '42' });
  });
});
