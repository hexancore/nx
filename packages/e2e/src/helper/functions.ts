import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { existsSync, mkdirSync, rmSync } from 'fs';

export function getTestWorkspaceRoot(): string {
  const root = process.env['TEST_WORKSPACE_ROOT'] ?? null;

  if (!root) {
    throw new Error('Empty env[TEST_WORKSPACE_ROOT]');
  }

  return root;
}

export function createTestWorkspace(name = 'test-workspace'): string {
  process.env['HUSKY'] = '0';

  const cwd = process.cwd();
  const workspaceRoot = join(cwd, 'tmp', name);

  if (existsSync(workspaceRoot)) {
    execNx(workspaceRoot, 'reset');
    rmSync(workspaceRoot, {
      recursive: true,
      force: true,
      maxRetries: 3,
      retryDelay: 3 * 1000,
    });
  }

  mkdirSync(dirname(workspaceRoot), {
    recursive: true,
  });

  process.env['PNPM_HOME'] = join(cwd, 'tmp', 'pnpm-store');

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

export function execNx(workspaceRoot: string, command: string): void {
  execSync(`nx ${command}`, {
    cwd: workspaceRoot,
    stdio: 'inherit',
    env: process.env,
    timeout: 3 * 60 * 1000
  });
}