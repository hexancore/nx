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

  test.each([
    {isApp: true, expected: 'app-acme-project'},
    {isApp: false, expected: 'acme-project'}
  ])('getProjectNameFromDirectory() isApp: $isApp', ({isApp, expected}) => {
    const current = HcNxHelper.getProjectNameFromDirectory('acme-project', isApp);

    expect(current).toEqual(expected);
  });

  test('getLibraryProjectRoot()', () => {
    const current = HcNxHelper.getLibraryProjectRoot('acme-project');

    expect(current).toEqual('libs/acme-project');
  });

  test('getApplicationProjectRoot()', () => {
    const current = HcNxHelper.getApplicationProjectRoot('acme-project');

    expect(current).toEqual('apps/acme-project');
  });

  test('getProjectImportName()', () => {
    const current = helper.getProjectImportName('acme-project');

    expect(current).toEqual('@acme/acme-project');
  });

  test('workspaceNxVersion', () => {
    const current = helper.workspaceNxVersion;

    expect(current).toEqual('10.10.10');
  });
});
