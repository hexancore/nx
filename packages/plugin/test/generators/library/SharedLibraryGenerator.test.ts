import { Tree } from '@nx/devkit';

import { libraryGenerator } from '../../../src/generators/library/libraryGenerator';
import { LibraryGeneratorSchema } from '../../../src/generators/library/schema';
import { createEmptyNxTree, exceptOnlyFilesFromListExistInWorkspace, exceptWorkspaceFileMatchSnapshot, expectedFiles } from '../../helper/functions';

describe('Library Generator: Shared', () => {
  let tree: Tree;
  const type = 'shared';
  const projectDirectory = `task-manager/${type}`;
  const projectRoot = `libs/${projectDirectory}`;
  beforeAll(async () => {
    tree = createEmptyNxTree();
    const options: LibraryGeneratorSchema = { directory: projectDirectory, type };
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
    'tsconfig.build.json',
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
    const expectedProjectFiles = expectedFiles(`${projectRoot}/`, [
      'src/index.ts',
      'test/config.ts',
      'test/unit/sample.test.ts',
      'test/helper/.gitkeep',
      'test/integration/.gitkeep',
      'src/Service/.gitkeep'
    ]);
    const expected = [
      '.prettierrc',
      ...expectedProjectFiles,
      ...expectedWorkspaceFilesToMatchSnapshots
    ];
    exceptOnlyFilesFromListExistInWorkspace(tree, expected);
  });
});
