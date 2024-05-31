import { execNx, getTestWorkspaceRoot } from '../helper/functions';
import { existsSync } from 'fs';
import { join } from 'path';

describe('Library', () => {
  const workspaceRoot = getTestWorkspaceRoot();

  describe.each(['backend', 'frontend', 'shared'])('Library %s', (type) => {
    beforeAll(() => {
      execNx(workspaceRoot, `g @hexancore/nx:lib acme/${type} --type ${type}`);
    });

    test('should be created', () => {
      expect(existsSync(join(workspaceRoot, `libs/acme/${type}`, 'package.json'))).toBeTruthy();
    });

    test('target build should pass', () => {
      execNx(workspaceRoot, `run acme-${type}:build`);

      const expectedIndex = type === 'frontend' ? 'index.mjs' : 'src/index.js';

      expect(existsSync(join(workspaceRoot, `dist/libs/acme/${type}/${expectedIndex}`))).toBeTruthy();
    });

    test('target test should pass', () => {
      execNx(workspaceRoot, `run acme-${type}:test`);
    });

    test('target lint should pass', () => {
      execNx(workspaceRoot, `run acme-${type}:lint`);
    });
  });
});

