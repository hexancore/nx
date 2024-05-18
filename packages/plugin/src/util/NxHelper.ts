import {
  readJsonFile,
  Tree
} from '@nx/devkit';
import { execSync } from 'child_process';
import * as path from 'path';

export class HcNxHelper {

  public static getVersion(): string {
    const packageJson = this.getPluginPackageJson();
    return packageJson['version'];
  }

  public static getPluginNxVersion(): string {
    const packageJson = this.getPluginPackageJson();
    return packageJson['dependencies']['@nx/devkit'];
  }

  public static getWorkspaceNxVersion(tree: Tree): string {
    if (tree.exists('package.json')) {
      const packageJson = readJsonFile(path.join(tree.root, 'package.json'));
      return packageJson.devDependencies['@nrwl/workspace'];
    }

    throw new Error('Not found workspace package.json');
  }

  public static getGlobalNxVersion(): string {
    const output = execSync('nx --version').toString();
    const regex = /- Global: v(\d+\.\d+\.\d+)/;
    const match = output.match(regex);

    if (match) {
      return match[1];
    }

    throw new Error('Not found Nx global version, install with `pnpm add --global nx`');
  }

  private static getPluginPackageJson(): Record<string, any> {
    const packageJsonPath = path.join(path.dirname(path.dirname(__dirname)), 'package.json');
    return readJsonFile(packageJsonPath);
  }
}