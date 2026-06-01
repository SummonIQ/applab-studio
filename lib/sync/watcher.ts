#!/usr/bin/env bun
/**
 * Sync Watcher
 * Continuously monitors the sync queue and processes pending items
 */

import { prisma } from '../db/prisma';
import { FilesystemSyncService } from './filesystem';

const POLL_INTERVAL = 2000; // Check every 2 seconds
const BATCH_SIZE = 10;

let hasWarnedMissingSyncQueue = false;

function timestamp() {
  return new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  });
}

function log(message: string) {
  console.log(`[${timestamp()}] [Sync Watcher] ${message}`);
}

function error(message: string, err?: any) {
  console.error(`[${timestamp()}] [Sync Watcher] ${message}`, err || '');
}

async function run() {
  log('Starting...');
  log(`Poll interval: ${POLL_INTERVAL}ms`);
  log(`Batch size: ${BATCH_SIZE}`);

  // Process immediately on start
  await processBatch();

  // Then set up interval
  setInterval(async () => {
    await processBatch();
  }, POLL_INTERVAL);
}

async function processBatch() {
  try {
    const syncQueue = (prisma as unknown as { syncQueue?: unknown }).syncQueue;
    if (!syncQueue) {
      if (!hasWarnedMissingSyncQueue) {
        log(
          'SyncQueue model not available on Prisma client; skipping sync processing.',
        );
        hasWarnedMissingSyncQueue = true;
      }
      return;
    }

    await FilesystemSyncService.processSyncQueue(BATCH_SIZE);
  } catch (err) {
    error('Error processing batch:', err);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('Shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Shutting down...');
  process.exit(0);
});

// Start the watcher
run().catch(error => {
  console.error('[Sync Watcher] Fatal error:', error);
  process.exit(1);
});
