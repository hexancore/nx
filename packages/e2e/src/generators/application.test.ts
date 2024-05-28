import { createTestWorkspace, execNx } from '../helper/functions';
import { existsSync } from 'fs';
import { join } from 'path';

describe('Application', () => {
  let workspaceRoot;

  beforeAll(() => {
    workspaceRoot = createTestWorkspace('application-test');
  });

  afterAll(() => {
    if (!workspaceRoot) {
      return;
    }
    execNx(workspaceRoot, 'reset');
  });

  describe.each(['backend'])('Application[%s]', (type) => {
    beforeAll(() => {
      execNx(workspaceRoot, `g @hexancore/nx:app acme/${type} --type ${type}`);
    });

    test('should be created', () => {
      expect(existsSync(join(workspaceRoot, `apps/acme/${type}`, 'package.json'))).toBeTruthy();
    });


    test('target build should pass', () => {
      execNx(workspaceRoot, `run app-acme-${type}:build`);

      expect(existsSync(join(workspaceRoot, `dist/apps/acme/${type}/src/main.js`))).toBeTruthy();
    });

    test('target test should pass', () => {
      execNx(workspaceRoot, `run app-acme-${type}:test`);
    });

    test('target lint should pass', () => {
      execNx(workspaceRoot, `run app-acme-${type}:lint`);
    });
  });
});

