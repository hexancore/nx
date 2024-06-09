import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { releasePublish, releaseVersion } from 'nx/release';
import { join } from 'path';

import { createTestWorkspace } from './functions';

export default async () => {
  // local registry target to run
  const localRegistryTarget = '@nx-hexancore/source:local-registry';
  const storage = './tmp/local-registry/storage';

  const cwd = process.cwd();
  process.env['PNPM_HOME'] = join(cwd, 'tmp', 'pnpm-store');
  process.env['NODE_PENDING_DEPRECATION'] = '0';

  if (existsSync(process.env['PNPM_HOME'])) {
    execSync('pnpm store prune', {
      env: process.env
    });
  }

  global.stopLocalRegistry = await startLocalRegistry({
    localRegistryTarget,
    storage,
    verbose: false,
  });

  await releaseVersion({
    specifier: '0.0.1-e2e',
    stageChanges: false,
    gitCommit: false,
    gitTag: false,
    firstRelease: true,
    generatorOptionsOverrides: {
      skipLockFileUpdate: true,
    },
  });
  await releasePublish({
    tag: 'e2e',
    firstRelease: true,
  });

  process.env['TEST_WORKSPACE_ROOT'] = createTestWorkspace();
};
