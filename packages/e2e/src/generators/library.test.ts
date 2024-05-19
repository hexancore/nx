
import { execSync } from 'child_process';
import { createTestWorkspace } from '../helper/createTestProject';
import { existsSync } from 'fs';
import { join } from 'path';

describe('Library', () => {
  let workspaceRoot;

  beforeAll(() => {
    workspaceRoot = createTestWorkspace('library-test');
    execSync('nx g @hexancore/nx:lib acme/backend --type backend', {
      cwd: workspaceRoot,
      stdio: 'inherit',
      env: process.env,
    });
  });

  test('should be created', () => {
    expect(existsSync(join(workspaceRoot, 'libs/acme/backend', 'package.json'))).toBeTruthy();
  });

  test('build should pass', () => {
    execSync('nx run acme-backend:build', {
      cwd: workspaceRoot,
      stdio: 'inherit',
      env: process.env,
    });

    expect(existsSync(join(workspaceRoot, 'dist/libs/acme/backend/src/index.js'))).toBeTruthy();
  });
});

