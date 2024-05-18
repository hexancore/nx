import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { existsSync, mkdirSync, rmSync } from 'fs';

describe('Plugin', () => {
  let projectDirectory: string;

  test('should be installed', () => {
    projectDirectory = createTestProject();
    expect(existsSync(join(projectDirectory,'package.json'))).toBeTruthy();
  });
});

/**
 * Creates a test project with create-nx-workspace and installs the plugin
 * @returns The directory where the test project was created
 */
function createTestProject(extraArgs = '') {
  const projectName = 'test-project';
  const projectDirectory = join(process.cwd(), 'tmp', projectName);

  rmSync(projectDirectory, {
    recursive: true,
    force: true,
  });
  mkdirSync(dirname(projectDirectory), {
    recursive: true,
  });

  process.env['PNPM_HOME'] = join(process.cwd(), 'tmp', 'pnpm-store');
  rmSync(process.env['PNPM_HOME'], {
    recursive: true,
    force: true,
  });

  const createWorkspaceScript = join(process.cwd(), 'tools', 'scripts', 'create-workspace.mjs');
  try {
    execSync(`node ${createWorkspaceScript} ${projectName} ${extraArgs}`, {
      cwd: dirname(projectDirectory),
      stdio: 'inherit',
      env: process.env,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }

  return projectDirectory;
}
