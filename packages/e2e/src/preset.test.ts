import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { mkdirSync, rmSync } from 'fs';

describe('Plugin', () => {
  let projectDirectory: string;

  it('should be installed', () => {
    projectDirectory = createTestProject();
    execSync('pnpm ls @hexancore/nx', {
      cwd: projectDirectory,
      stdio: 'inherit',
    });
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

  const createWorkspaceScript = join(process.cwd(), 'tools', 'scripts', 'create-workspace.ts');
  try {
    execSync(`pnpm tsx ${createWorkspaceScript} ${projectName} ${extraArgs}`, {
      cwd: dirname(projectDirectory),
      stdio: 'inherit',
      env: process.env,
    });
  } catch (e) {
    console.error(e);
    throw e;
  }


  console.log(`Created test project in "${projectDirectory}"`);

  return projectDirectory;
}
