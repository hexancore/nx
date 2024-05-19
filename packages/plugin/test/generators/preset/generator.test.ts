import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { presetGenerator } from '../../../src/generators/preset/generator';
import { PresetGeneratorSchema } from '../../../src/generators/preset/schema';
import {exceptWorkspaceFileMatchSnapshot } from '../../helper/functions';

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
  ];
  test.each(expectedWorkespaceFilesToMatchSnapshots.map(i => [i]))('%s should match snapshot', (filePath) => {
    exceptWorkspaceFileMatchSnapshot(tree, filePath);
  });

  test('only file from list should exist', () => {
    const expectedWorkspaceFilesToExists = [
      'Makefile',
      'tsconfig.base.json',
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
      ...expectedWorkespaceFilesToMatchSnapshots
    ];
    const diff = tree.listChanges().map(c => c.path).filter(x => !expectedWorkspaceFilesToExists.includes(x));
    expect(diff).toEqual([]);
  });

});
