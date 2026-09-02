// The public Astro API keeps the test server in the foreground in every shell.
import { preview } from 'astro';
const server = await preview({ server: { host: '127.0.0.1', port: 4325 } });
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => {
    await server.stop();
    process.exit(0);
  });
}
