import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { existsSync, rmSync } from 'fs';
import { releasePublish, releaseVersion } from 'nx/release';
import { join } from 'path';

export default async () => {
  // local registry target to run
  const localRegistryTarget = '@nx-hexancore/source:local-registry';
  const storage = './tmp/local-registry/storage';


  const cwd = process.cwd();
  process.env['PNPM_HOME'] = join(cwd, 'tmp', 'pnpm-store');
  if (existsSync(process.env['PNPM_HOME'])) {
    rmSync(process.env['PNPM_HOME'], {
      recursive: true,
      force: true,
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
};
