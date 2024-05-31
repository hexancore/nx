import { writeJson, type Tree } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";

export function createEmptyNxTree(): Tree {
  const tree = createTreeWithEmptyWorkspace();
  writeJson(tree, 'package.json', {
    name: '@testcompany/source'
  });

  return tree;
}

export function exceptWorkspaceFileMatchSnapshot(tree: Tree, filePath: string): void {
  expect(tree.exists(filePath)).toBeTruthy();
  const contents = tree.read(filePath)?.toString();
  expect(contents).toMatchSnapshot();
}

export function exceptOnlyFilesFromListExistInWorkspace(tree: Tree, expected: string[]): void {
  const diff = tree.listChanges().map(c => c.path).filter(x => !expected.includes(x));
  expect(diff).toEqual([]);
}

export function expectedFiles(prefix: string, files: string[]) {
  return files.map((f) => prefix + f);
}