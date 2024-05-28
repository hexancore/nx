import { Tree, writeJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { HcNxHelper } from '../../src/util';

describe(HcNxHelper.constructor.name, () => {
  let tree: Tree;
  let helper: HcNxHelper;

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    writeJson(tree, 'package.json', {
      name: '@acme/source',
      devDependencies: {
        '@nrwl/workspace': '10.10.10',
      }
    });
    helper = new HcNxHelper(tree);
  });

  test('workspaceNxVersion', () => {
    const current = helper.workspaceNxVersion;

    expect(current).toEqual('10.10.10');
  });
});
