import { execNx, getTestWorkspaceRoot } from '../helper/functions';
import { existsSync } from 'fs';
import { join } from 'path';

describe('Application', () => {
  const workspaceRoot = getTestWorkspaceRoot();

  describe.each(['backend', 'frontend'])('Application[%s]', (type) => {
    beforeAll(() => {
      execNx(workspaceRoot, `g @hexancore/nx:app acme/${type} --type ${type}`);
    });

    test('should be created', () => {
      expect(existsSync(join(workspaceRoot, `apps/acme/${type}`, 'project.json'))).toBeTruthy();
    });


    test('target build should pass', () => {
      execNx(workspaceRoot, `run app-acme-${type}:build`);

      const mainFile = type === 'frontend' ? 'index.html' : 'src/main.js';

      expect(existsSync(join(workspaceRoot, `dist/apps/acme/${type}/${mainFile}`))).toBeTruthy();
    });

    test('target test should pass', () => {
      execNx(workspaceRoot, `run app-acme-${type}:test`);
    });

    test('target lint should pass', () => {
      execNx(workspaceRoot, `run app-acme-${type}:lint`);
    });
  });
});

