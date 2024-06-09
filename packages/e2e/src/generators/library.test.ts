import { execNx, getTestWorkspaceRoot } from '../helper/functions';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';

describe('Library Generator', () => {
  const workspaceRoot = getTestWorkspaceRoot();

  beforeAll(() => {
    ['backend', 'frontend', 'shared'].forEach((type) => {
      execNx(workspaceRoot, `g @hexancore/nx:lib acme/${type} --type ${type}`);
    });
  });

  describe.each(['backend', 'frontend', 'shared'])('%s', (type) => {
    test('should be created', () => {
      expect(existsSync(join(workspaceRoot, `libs/acme/${type}`, 'package.json'))).toBeTruthy();
    });

    test('target test should pass', () => {
      execNx(workspaceRoot, `run acme-${type}:test`);
    });

    test('target lint should pass', () => {
      execNx(workspaceRoot, `run acme-${type}:lint`);
    });
  });

  describe('backend', () => {
    test('target build should pass', () => {
      execNx(workspaceRoot, `run acme-backend:build`);

      expect(existsSync(join(workspaceRoot, `dist/libs/acme/backend/src/index.js`))).toBeTruthy();
    });
  });

  describe('shared', () => {
    test('target build should pass', () => {
      execNx(workspaceRoot, `run acme-shared:build`);

      expect(existsSync(join(workspaceRoot, `dist/libs/acme/shared/src/index.js`))).toBeTruthy();
    });
  });


  describe('frontend', () => {
    test('target build should pass', () => {
      execNx(workspaceRoot, `run acme-frontend:build`);

      const distDir = 'dist/libs/acme/frontend';
      const expectedDistFiles = [
        'Asset/Style/variables.css',
        'Component/Button/Button.css',
        'Component/Button/Button.script.js',
        'Component/Button/Button.vue.js'
      ].map((f) => `${distDir}/${f}`);

      // only when run e2e tests it's appears.
      if (existsSync(`${distDir}/ugin-vue_export-helper`)) {
        rmSync(`${distDir}/ugin-vue_export-helper`);
      }

      expectedDistFiles.forEach((f) => {
        expect(existsSync(join(workspaceRoot, f))).toBeTruthy();
      });

    });

    test('target storybook-build should pass', () => {
      execNx(workspaceRoot, `run acme-frontend:storybook-build`);
    });
  });

});

