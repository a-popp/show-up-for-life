export function installGracefulShutdown(stop: () => void): void {
  const shutdown = () => {
    stop();
  };

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}
