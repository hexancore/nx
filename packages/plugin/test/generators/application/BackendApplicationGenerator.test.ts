import { Tree, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { exceptWorkspaceFileMatchSnapshot } from '../../helper/functions';
import type { ApplicationGeneratorSchema } from '../../../src/generators/application/schema';
import { applicationGenerator } from '../../../src/generators/application/applicationGenerator';

describe('Application Generator', () => {
  describe('frontend', () => {
    let tree: Tree;
    const directory = 'task-manager/api';
    const projectRoot = `apps/${directory}`;

    beforeAll(async () => {
      tree = createTreeWithEmptyWorkspace();
      writeJson(tree, 'package.json', {
        name: '@testcompany/source'
      });
      const options: ApplicationGeneratorSchema = { directory, type: 'backend' };
      await applicationGenerator(tree, options);
    });

    const expectedProjectFilesToMatchSnapshots = [
      'README.md',
      'project.json',
      'package.json',
      '.eslintrc.json',
      'jest.config.ts',
      'tsconfig.json',
      'tsconfig.test.json',
      'tsconfig.build.json',
      'src/main.ts'
    ].map(f => `${projectRoot}/` + f);

    const expectedWorkspaceFilesToMatchSnapshots = [
      'tsconfig.base.json',
      'nx.json',
      'package.json',
      ...expectedProjectFilesToMatchSnapshots
    ];

    test.each(expectedWorkspaceFilesToMatchSnapshots.map(i => [i]))('%s should match snapshot', (filePath) => {
      exceptWorkspaceFileMatchSnapshot(tree, filePath);
    });

    test('only file from list should exist', () => {
      const expectedWorkspaceFilesToExists = [
        '.prettierrc',
        `${projectRoot}/test/helper/.gitkeep`,
        `${projectRoot}/test/config.ts`,
        `${projectRoot}/test/unit/sample.test.ts`,
        `${projectRoot}/test/integration/.gitkeep`,
        ...expectedWorkspaceFilesToMatchSnapshots
      ];
      const diff = tree.listChanges().map(c => c.path).filter(x => !expectedWorkspaceFilesToExists.includes(x));
      expect(diff).toEqual([]);
    });
  });
});
