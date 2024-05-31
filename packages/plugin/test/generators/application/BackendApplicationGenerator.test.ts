import { Tree } from '@nx/devkit';
import { applicationGenerator } from '../../../src/generators/application/applicationGenerator';
import type { ApplicationGeneratorSchema } from '../../../src/generators/application/schema';
import { createEmptyNxTree, exceptWorkspaceFileMatchSnapshot, expectedFiles } from '../../helper/functions';

describe('Application Generator: Backend', () => {
  let tree: Tree;
  const type = 'backend';
  const projectDirectory = `acme/${type}`;
  const projectRoot = `apps/${projectDirectory}`;
  beforeAll(async () => {
    tree = createEmptyNxTree();
    const options: ApplicationGeneratorSchema = { directory: projectDirectory, type };
    await applicationGenerator(tree, options);
  });

  const expectedProjectFilesToMatchSnapshots = expectedFiles(`${projectRoot}/`, [
    'README.md',
    'project.json',
    'package.json',
    '.eslintrc.json',
    'jest.config.ts',
    'tsconfig.json',
    'tsconfig.test.json',
    'tsconfig.build.json',
    'src/main.ts'
  ]);

  const expectedWorkspaceFilesToMatchSnapshots = [
    ...expectedProjectFilesToMatchSnapshots,
    '.prettierrc',
    'package.json',
    'nx.json',
    'tsconfig.base.json',
  ];

  test.each(expectedWorkspaceFilesToMatchSnapshots.map(i => [i]))('%s should match snapshot', (filePath) => {
    exceptWorkspaceFileMatchSnapshot(tree, filePath);
  });

  test('only file from list should exist', () => {
    const expectedWorkspaceFilesToExists = [
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
