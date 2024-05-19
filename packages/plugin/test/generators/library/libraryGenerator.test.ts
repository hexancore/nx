import { Tree, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { libraryGenerator } from '../../../src/generators/library/libraryGenerator';
import { LibraryGeneratorSchema } from '../../../src/generators/library/schema';
import { exceptWorkspaceFileMatchSnapshot } from '../../helper/functions';

describe('library generator', () => {
  describe('configuration', () => {
    let tree: Tree;
    beforeAll(async () => {
      tree = createTreeWithEmptyWorkspace();
      writeJson(tree, 'package.json', {
        name: '@testcompany/source'
      });
      const options: LibraryGeneratorSchema = { directory: 'task-manager/backend', type: 'backend' };
      await libraryGenerator(tree, options);
    });

    const expectedProjectFilesToMatchSnapshots = [
      'README.md',
      'project.json',
      'package.json',
      '.eslintrc.json',
      'jest.config.ts',
      'tsconfig.json',
      'tsconfig.test.json',
      'tsconfig.lib.json',
    ].map(f => 'libs/task-manager/backend/' + f);

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
        'libs/task-manager/backend/src/index.ts',
        'libs/task-manager/backend/test/unit/sample.test.ts',
        'libs/task-manager/backend/test/helper/.gitkeep',
        'libs/task-manager/backend/test/unit/.gitkeep',
        'libs/task-manager/backend/test/integration/.gitkeep',
        ...expectedWorkspaceFilesToMatchSnapshots
      ];
      const diff = tree.listChanges().map(c => c.path).filter(x => !expectedWorkspaceFilesToExists.includes(x));
      expect(diff).toEqual([]);
    });
  });
});
