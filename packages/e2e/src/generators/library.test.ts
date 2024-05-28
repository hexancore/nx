import { createTestWorkspace, execNx } from '../helper/functions';
import { existsSync } from 'fs';
import { join } from 'path';

describe('Library', () => {
  let workspaceRoot;

  beforeAll(() => {
    workspaceRoot = createTestWorkspace('library-test');
  });

  afterAll(() => {
    if (!workspaceRoot) {
      return;
    }
    execNx(workspaceRoot, 'reset');
  });

  describe.each(['backend', 'shared'])('Library %s', (type) => {
    beforeAll(() => {
      execNx(workspaceRoot, `g @hexancore/nx:lib acme/${type} --type ${type}`);
    });

    test('should be created', () => {
      expect(existsSync(join(workspaceRoot, `libs/acme/${type}`, 'package.json'))).toBeTruthy();
    });

    test('target build should pass', () => {
      execNx(workspaceRoot, `run acme-${type}:build`);

      expect(existsSync(join(workspaceRoot, `dist/libs/acme/${type}/src/index.js`))).toBeTruthy();
    });

    test('target test should pass', () => {
      execNx(workspaceRoot, `run acme-${type}:test`);
    });

    test('target lint should pass', () => {
      execNx(workspaceRoot, `run acme-${type}:lint`);
    });
  });
});

