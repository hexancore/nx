import type { ProjectConfiguration } from "@nx/devkit";
import { readFileSync } from "fs";
import { glob } from 'glob';
import path from "path";

export interface FilesystemAdapter {
  readFileSync: (path: string, options?: any) => Buffer;
  globSync: typeof glob.sync;
}

export class HcNxRuntimeHelper {
  private fs: FilesystemAdapter;

  private _workspacePackageJson?: Record<string, any>;
  private _workspacePackageScope?: string;

  public constructor(public readonly workspaceDir: string, fs?: FilesystemAdapter) {
    this.fs = fs ?? ({ readFileSync, globSync: glob.sync });
  }

  public get workspacePackageScope(): string {
    if (!this._workspacePackageScope) {
      this._workspacePackageScope = this.workspacePackageJson.name.split('/')[0];
    }

    return this._workspacePackageScope;
  }

  public get workspacePackageJson(): Record<string, string> {
    if (!this._workspacePackageJson) {
      this._workspacePackageJson = JSON.parse(this.fs.readFileSync(this.workspaceDir + '/package.json').toString());
    }

    return this._workspacePackageJson as any;
  }

  public getLibsProjectName2RootMap(): Map<string, string> {
    const map = new Map();
    this.fs.globSync('**/project.json', { posix: true, nodir: true, cwd: this.workspaceDir + '/libs' }).forEach((projectRoot: string) => {
      const name = projectRoot.slice(0, -('/project.json'.length)).replaceAll('/', '-');
      map.set(name, 'libs/' + projectRoot);
    });

    return map;
  }

  public getProjectJson(projectRoot: string): ProjectConfiguration {
    if (!path.isAbsolute(projectRoot)) {
      projectRoot = this.workspaceDir + "/" + projectRoot;
    }

    return JSON.parse(this.fs.readFileSync(projectRoot + '/project.json').toString()) as any;
  }

}