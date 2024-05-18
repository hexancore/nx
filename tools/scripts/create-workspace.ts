#!/usr/bin/env node

import { execSync } from 'child_process';
import { createWorkspace } from 'create-nx-workspace';

async function main() {
  const name = process.argv[2];
  if (!name) {
    throw new Error('Please provide a name for the workspace');
  }

  const version = process.argv[3] ?? '0.0.1-e2e';

  console.log(`Creating the workspace: ${name}`);

  // CLEAR store before install - somehow stores old package and integrity hash error occures.
  try {
    execSync('pnpm store prune', {
      env: process.env
    });
  } catch (e) {

  }

  const { directory } = await createWorkspace(`@hexancore/nx@${version}`, {
    name,
    nxCloud: 'skip',
    packageManager: 'pnpm',
    verbose: true,
  });

  console.log(`Successfully created the workspace: ${directory}.`);
}

main();
