import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { presetGenerator } from '../../../src/generators/preset/generator';
import { PresetGeneratorSchema } from '../../../src/generators/preset/schema';
import { exceptWorkspaceFileMatchSnapshot } from '../../helper/functions';

describe('preset generator', () => {
  let tree: Tree;

  const options: PresetGeneratorSchema = { name: 'test-workspace' };
  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    await presetGenerator(tree, options);
  });

  const expectedWorkespaceFilesToMatchSnapshots = [
    'nx.json',
    'package.json',
    '.env',
    '.env.development',
    '.env.test',
    '.npmrc',
    'CONTRIBUTING.md',
    'README.md',
    'docker/app/Dockerfile',
    'docker/app/pm2.config.cjs',
    'docker/dev/.env',
    'Makefile',
    'tsconfig.base.json',

    'docker-compose-dev.yaml',
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
      '.vscode/extensions.json',
      '.vscode/settings.json.template',
      '.husky/install.mjs',
      '.husky/pre-commit',
      'jest.config.ts',
      'jest.preset.ts',
      'bin/util/MakeHelp',
      'bin/util/util.sh',
      'docker/dev/ca/ca.crt',
      'docker/dev/ca/ca.key',
      'docker/dev/ca/ca.srl',
      'docker/dev/ca/certs/db/db.crt',
      'docker/dev/ca/certs/db/db.key',
      'docker/dev/ca/certs/redis/redis.crt',
      'docker/dev/ca/certs/redis/redis.key',
      'docker/dev/ca/create_ca.sh',
      'docker/dev/ca/gen_cert.sh',
      'docker/dev/redis/users.acl',
      ...expectedWorkespaceFilesToMatchSnapshots
    ];
    const diff = tree.listChanges().map(c => c.path).filter(x => !expectedWorkspaceFilesToExists.includes(x));
    expect(diff).toEqual([]);
  });

});
