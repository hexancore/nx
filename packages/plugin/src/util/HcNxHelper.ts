import {
  Tree,
  readJsonFile
} from '@nx/devkit';
import { execSync } from 'child_process';
import * as path from 'path';

import { HcNxProjectHelper } from './HcNxProjectHelper';

export class HcNxHelper {

  private static cachedPluginPackageJson: Record<string, any>;
  private _workspacePackageNamespace!: string;

  public project: HcNxProjectHelper;

  public constructor(public readonly tree: Tree) {
    this.project = new HcNxProjectHelper(this);
  }

  public get workspacePackageNamespace(): string {
    if (!this._workspacePackageNamespace) {
      this._workspacePackageNamespace = this.getWorkspacePackageJson().name.split('/')[0];
    }
    return this._workspacePackageNamespace;
  }

  public get workspaceNxVersion(): string {
    return this.getWorkspacePackageJson().devDependencies['@nrwl/workspace'];
  }

  private getWorkspacePackageJson(): Record<string, any> {
    if (this.tree.exists('package.json')) {
      return JSON.parse(this.tree.read('package.json')?.toString() ?? "");
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

  public static get pluginVersion(): string {
    const packageJson = this.getPluginPackageJson();
    return packageJson['version'];
  }

  public static get pluginNxVersion(): string {
    const packageJson = this.getPluginPackageJson();
    return packageJson['dependencies']['@nx/devkit'];
  }

  private static getPluginPackageJson(): Record<string, any> {
    if (!this.cachedPluginPackageJson) {
      const packageJsonPath = path.join(path.dirname(path.dirname(__dirname)), 'package.json');
      this.cachedPluginPackageJson = readJsonFile(packageJsonPath);
    }

    return this.cachedPluginPackageJson;
  }
}