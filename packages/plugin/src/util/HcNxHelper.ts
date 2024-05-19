import {
  readJsonFile,
  Tree,
  addProjectConfiguration,
  generateFiles
} from '@nx/devkit';
import { execSync } from 'child_process';
import * as path from 'path';

import { ProjectMeta } from './ProjectMeta';

export class HcNxHelper {

  private static cachedPluginPackageJson: Record<string, any>;
  private _workspacePackageNamespace!: string;

  public constructor(public readonly tree: Tree) {

  }

  public createProjectMeta(directory: string, isApp: boolean): ProjectMeta {
    const name = HcNxHelper.getProjectNameFromDirectory(directory, isApp);
    return {
      name,
      root: HcNxHelper.getProjectRoot(directory, isApp),
      importName: this.getProjectImportName(name),
      type: isApp ? 'application' : 'library',
    };
  }

  public static getProjectNameFromDirectory(directory: string, isApp: boolean): string {
    const name = directory.replaceAll('/', '-');
    return isApp ? `app-${name}` : name;
  }

  public static getProjectRoot(directory: string, isApp: boolean): string {
    return isApp ? this.getApplicationProjectRoot(directory) : this.getLibraryProjectRoot(directory);
  }

  public static getLibraryProjectRoot(directory: string): string {
    return `libs/${directory}`;
  }

  public static getApplicationProjectRoot(directory: string): string {
    return `apps/${directory}`;
  }

  public getProjectImportName(name: string): string {
    return this.workspacePackageNamespace + '/' + name;
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

  public generateProjectFiles<T extends Record<string, any>>(project: ProjectMeta, srcDir: string, target: string, context?: T) {
    const templateContext = {
      tmpl: '',
      project: project,
      ...context,
    };

    generateFiles(this.tree, srcDir, path.join(project.root, target), templateContext);
  }

  public addProjectConfiguration(options: ProjectMeta): void {
    addProjectConfiguration(this.tree, options.name, {
      root: options.root,
      projectType: options.type,
      sourceRoot: '{projectRoot}/src',
      targets: {
        "build": {
          "executor": "@nx/js:tsc",
          "outputs": [
            "{options.outputPath}"
          ],
          "options": {
            "outputPath": "dist/{projectRoot}",
            "main": "{projectRoot}/src/index.ts",
            "tsConfig": "{projectRoot}/tsconfig.lib.json"
          }
        },
        "lint": {
          "executor": "@nx/eslint:lint",
          "options": {
            "lintFilePatterns": [
              "{projectRoot}/**/*.ts",
              "{projectRoot}/package.json"
            ]
          }
        },
        "lint-fix": {
          "executor": "@nx/eslint:lint",
          "options": {
            "fix": true,
            "lintFilePatterns": [
              "{projectRoot}/**/*.ts",
              "{projectRoot}/package.json"
            ]
          }
        },
        "test": {
          "executor": "@nx/jest:jest",
          "defaultConfiguration": "test",
          "options": {
            "jestConfig": "{projectRoot}/jest.config.ts",
            "runInBand": true,
            "passWithNoTests": true
          }
        },
        "test-watch": {
          "executor": "@nx/jest:jest",
          "defaultConfiguration": "test",
          "options": {
            "jestConfig": "{projectRoot}/jest.config.ts",
            "runInBand": true,
            "passWithNoTests": true,
            "watch": true
          }
        }
      }
    });
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