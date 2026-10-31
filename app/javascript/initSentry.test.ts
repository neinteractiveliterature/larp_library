const init = vi.fn();
const setUser = vi.fn();
vi.mock('@sentry/browser', () => ({ init, setUser }));

async function loadInitSentry() {
  vi.resetModules();
  await import('./initSentry');
}

describe('initSentry', () => {
  beforeEach(() => {
    init.mockClear();
    setUser.mockClear();
    delete window.larpLibrarySentryDsn;
    delete window.larpLibraryCurrentUserId;
  });

  it('does nothing when no DSN is configured', async () => {
    await loadInitSentry();

    expect(init).not.toHaveBeenCalled();
    expect(setUser).not.toHaveBeenCalled();
  });

  it('starts Sentry with the configured DSN', async () => {
    window.larpLibrarySentryDsn = 'https://key@example.ingest.sentry.io/123';

    await loadInitSentry();

    expect(init).toHaveBeenCalledWith({ dsn: 'https://key@example.ingest.sentry.io/123' });
    expect(setUser).not.toHaveBeenCalled();
  });

  it('tags errors with the signed-in user', async () => {
    window.larpLibrarySentryDsn = 'https://key@example.ingest.sentry.io/123';
    window.larpLibraryCurrentUserId = 42;

    await loadInitSentry();

    expect(setUser).toHaveBeenCalledWith({ id: '42' });
  });
});
