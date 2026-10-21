import { describe, it, expect } from 'vitest';
import net from 'net';
import { runSimulation } from '../../../../../../scripts/e2e-simulation.js';

async function isMongoReachable(uri: string = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const match = uri.match(/mongodb:\/\/(?:[^@]+@)?([^/:]+)(?::(\d+))?/);
      const rawHost = match?.[1] || '127.0.0.1';
      const host = rawHost === 'localhost' ? '127.0.0.1' : rawHost;
      const port = Number(match?.[2]) || 27017;
      const socket = net.createConnection({ host, port, timeout: 2000 });
      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });
      socket.on('error', () => {
        socket.destroy();
        resolve(false);
      });
      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });
    } catch {
      resolve(false);
    }
  });
}

describe('Task T-01: Automated Headless E2E Simulation', () => {
  it('should execute the entire hyperlocal commerce lifecycle without failure', async (ctx) => {
    const mongoAvailable = await isMongoReachable();
    if (!mongoAvailable) {
      console.warn('⚠️ MongoDB is not accessible on 127.0.0.1:27017. Skipping headless E2E simulation in this environment.');
      ctx.skip();
      return;
    }

    // Run simulation programmatically
    const success = await runSimulation();
    expect(success).toBe(true);
  }, 45000); // 45s timeout for full simulation
});

