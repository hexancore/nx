import type { Tree } from "@nx/devkit";

export function exceptWorkspaceFileMatchSnapshot(tree: Tree, filePath: string): void {
  expect(tree.exists(filePath)).toBeTruthy();
  const contents = tree.read(filePath)?.toString();
  expect(contents).toMatchSnapshot();
}