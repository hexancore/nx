import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { presetGenerator } from '../../../src/generators/preset/generator';
import { PresetGeneratorSchema } from '../../../src/generators/preset/schema';
import { exceptWorkspaceFileMatchSnapshot, expectedFiles } from '../../helper/functions';

describe('preset generator', () => {
  let tree: Tree;

  const options: PresetGeneratorSchema = { name: 'test-workspace' };
  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    await presetGenerator(tree, options);
  });

  const expectedDotWorkspaceDirFilesToMatchSnapshots = expectedFiles('.workspace/', [
    'jest/jest.preset.ts',
    'storybook/storybook.preset.ts',
    'vite/assets.ts',
    'vite/vite.preset.ts',
  ]);

  const expectedDotDockerDirFilesToMatchSnapshots = expectedFiles('.workspace/docker/', [
    'app/Dockerfile',
    'app/pm2.config.cjs',
    'dev/.env',
    'dev/docker-compose-dev.yaml',
  ]);

  const expectedWorkespaceFilesToMatchSnapshots = [
    'nx.json',
    'package.json',
    '.env',
    '.env.development',
    '.env.test',
    '.npmrc',
    'CONTRIBUTING.md',
    'README.md',
    'Makefile',
    'tsconfig.base.json',
    ...expectedDotWorkspaceDirFilesToMatchSnapshots,
    ...expectedDotDockerDirFilesToMatchSnapshots
  ];
  test.each(expectedWorkespaceFilesToMatchSnapshots.map(i => [i]))('%s should match snapshot', (filePath) => {
    exceptWorkspaceFileMatchSnapshot(tree, filePath);
  });

  test('only file from list should exist', () => {
    const expectedWorkspaceFilesToExists = [
      '.eslintignore',
      '.eslintrc.json',
      '.prettierrc',
      '.gitignore',
      '.gitattributes',
      '.editorconfig',
      '.dockerignore',
      '.prettierignore',
      '.prettierrc.js',
      '.vscode/extensions.json',
      '.vscode/settings.json.template',
      '.husky/install.mjs',
      '.husky/pre-commit',
      'jest.config.ts',
      '.workspace/bin/util/MakeHelp',
      '.workspace/bin/util/util.sh',
      ...expectedFiles('.workspace/docker/', [
        'dev/ca/ca.crt',
        'dev/ca/ca.key',
        'dev/ca/ca.srl',
        'dev/ca/certs/db/db.crt',
        'dev/ca/certs/db/db.key',
        'dev/ca/certs/redis/redis.crt',
        'dev/ca/certs/redis/redis.key',
        'dev/ca/create_ca.sh',
        'dev/ca/gen_cert.sh',
        'dev/redis/users.acl',
      ]),
      ...expectedWorkespaceFilesToMatchSnapshots
    ];
    const diff = tree.listChanges().map(c => c.path).filter(x => !expectedWorkspaceFilesToExists.includes(x));
    expect(diff).toEqual([]);
  });

});
