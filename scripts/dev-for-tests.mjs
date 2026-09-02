import { dev } from 'astro';

// Keep a fresh development server in the foreground; Playwright owns its lifetime.
const server = await dev({ server: { host: '127.0.0.1', port: 4327 } });
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => {
    await server.stop();
    process.exit(0);
  });
}
