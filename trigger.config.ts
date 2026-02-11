import { defineConfig } from '@trigger.dev/sdk/v3';

export default defineConfig({
  project: 'proj_quuukqeqnjkgwxsjzxmf',
  runtime: 'node',
  logLevel: 'log',
  maxDuration: 300,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ['packages/jobs/src'],

  // Global lifecycle hooks
  init: async () => {
    // Runs before any task executes - connect to DB
    const { prisma } = await import('@lifeos/db');
    await prisma.$connect();
  },
});
