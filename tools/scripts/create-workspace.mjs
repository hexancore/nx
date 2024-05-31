#!/usr/bin/env node
// Usage: node tools/create-workspace.mjs <name> [plugin-version]

import { createWorkspace } from 'create-nx-workspace';

async function main() {
  const name = process.argv[2];
  if (!name) {
    throw new Error('Please provide a name for the workspace');
  }
  const version = process.argv[3] ?? '0.0.1-e2e';

  console.log(`[${new Date().toISOString()}] Creating the workspace: ${name}`);

  const { directory } = await createWorkspace(`@hexancore/nx@${version}`, {
    name,
    nxCloud: 'skip',
    packageManager: 'pnpm',
    verbose: true,
  });

  console.log(`[${new Date().toISOString()}] Successfully created the workspace: ${directory}.`);
}

main();
