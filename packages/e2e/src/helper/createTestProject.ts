import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { mkdirSync, rmSync } from 'fs';

export function createTestWorkspace(name: string): string {
  process.env['HUSKY'] = '0';

  const cwd = process.cwd();
  const workspaceRoot = join(cwd, 'tmp', name);

  rmSync(workspaceRoot, {
    recursive: true,
    force: true,
  });

  mkdirSync(dirname(workspaceRoot), {
    recursive: true,
  });

  process.env['PNPM_HOME'] = join(cwd, 'tmp', 'pnpm-store');
  rmSync(process.env['PNPM_HOME'], {
    recursive: true,
    force: true,
  });

  const createWorkspaceScript = join(cwd, 'tools', 'scripts', 'create-workspace.mjs');
  try {
    execSync(`node ${createWorkspaceScript} ${name}`, {
      cwd: dirname(workspaceRoot),
      stdio: 'inherit',
      env: process.env,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }

  return workspaceRoot;
}