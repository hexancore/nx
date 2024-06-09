import { writeJson, type Tree } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { HcNxRuntimeHelper } from "../../src/util/HcNxRuntimeHelper";
import type { GlobOptions } from "glob";

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

export function createFakeRuntimeHelper(options: {
  globs: Record<string, string[]>;
  readFiles: Record<string, string>;
}): HcNxRuntimeHelper {
  const globSync: any = (pattern: string): string[] => {
    if (!options.globs[pattern]) {
      throw new Error("Unexpected glob: " + pattern);
    }

    return options.globs[pattern];
  };

  return new HcNxRuntimeHelper('/root', {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    globSync,
    readFileSync: (path: string): Buffer => {
      if (!options.readFiles[path]) {
        throw new Error("Unexpected read file: " + path);
      }
      return Buffer.from(options.readFiles[path]);
    }
  });
}