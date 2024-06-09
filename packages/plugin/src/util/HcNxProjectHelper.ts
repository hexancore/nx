import {
  Tree,
  addProjectConfiguration,
  generateFiles,
  updateJson
} from '@nx/devkit';
import * as path from 'path';
import type { ApplicationType } from '../generators/application/ApplicationType';
import type { LibraryType } from '../generators/library/LibraryType';
import type { HcNxHelper } from './HcNxHelper';
import { HcNxProjectTargetHelper } from './HcNxProjectTargetHelper';
import { HcNxProjectMeta, type ApplicationProjectMeta, type HcNxProjectDirectoryMeta, type LibraryProjectMeta, type ProjectSubtype } from './HcNxProjectMeta';
import { ProjectPackageJsonGenerator } from './ProjectPackageJsonGenerator';

export class HcNxProjectHelper {

  protected targetHelper: HcNxProjectTargetHelper;

  public constructor(protected helper: HcNxHelper) {
    this.targetHelper = new HcNxProjectTargetHelper();
  }

  protected get tree(): Tree {
    return this.helper.tree;
  }

  public addApplication(directory: string, type: ApplicationType): ApplicationProjectMeta {
    const project = HcNxProjectHelper.createProjectMeta<ApplicationType>(directory, type, this.helper.workspacePackageScope, true);
    this.addProjectConfiguration(project);
    if (type === 'backend') {
      ProjectPackageJsonGenerator.run(this.tree, { project });
    }
    return project;
  }

  public addLibrary(directory: string, type: LibraryType): LibraryProjectMeta {
    const project = HcNxProjectHelper.createProjectMeta<LibraryType>(directory, type, this.helper.workspacePackageScope, false);
    this.addProjectConfiguration(project);
    this.appendLibToWorkspaceTsPaths(project);
    ProjectPackageJsonGenerator.run(this.tree, { project });
    return project;
  }

  public static createProjectMeta<T extends ProjectSubtype>(
    directory: string,
    subtype: T,
    workspacePackageScope: string,
    isApp: boolean,
  ): HcNxProjectMeta<T> {
    let projectDirectoryMeta: HcNxProjectDirectoryMeta;

    if (path.isAbsolute(directory)) {
      projectDirectoryMeta = this.getProjectDirectoryMetaFromAbsolute(directory);
    } else {
      const projectRoot = HcNxProjectHelper.getProjectRoot(directory, isApp);
      const relativeWorkspaceRoot = '../'.repeat(projectRoot.split('/').length).slice(0, -1);
      projectDirectoryMeta = {
        name: HcNxProjectHelper.getProjectNameFromDirectory(directory, isApp),
        root: HcNxProjectHelper.getProjectRoot(directory, isApp),
        type: isApp ? 'application' : 'library',
        isApp,
        relative: {
          workspaceRoot: relativeWorkspaceRoot,
          dotWorkspace: relativeWorkspaceRoot + '/.workspace',
        },
      };
    }

    return {
      ...projectDirectoryMeta,
      importName: workspacePackageScope + '/' + projectDirectoryMeta.name,
      subtype: subtype
    };
  }

  public static getProjectNameFromDirectory(directory: string, isApp: boolean): string {
    const name = directory.replaceAll('/', '-');
    return isApp ? `app-${name}` : name;
  }

  public static getProjectRoot(directory: string, isApp: boolean): string {
    const prefix = isApp ? 'apps' : 'libs';
    return `${prefix}/${directory}`;
  }

  public static getProjectDirectoryMetaFromAbsolute(dir: string): HcNxProjectDirectoryMeta {
    dir = path.normalize(dir);
    const dirParts = dir.replaceAll('\\', '/').split('/');
    let isApp = false;
    const projectDirectory: string[] = [];
    for (let i = dirParts.length - 1; i >= 0; i--) {
      if (dirParts[i] === 'apps' || dirParts[i] === 'libs') {
        isApp = dirParts[i] === 'apps';
        const directory = projectDirectory.join('/');
        const name = HcNxProjectHelper.getProjectNameFromDirectory(directory, isApp);
        const projectRoot = HcNxProjectHelper.getProjectRoot(directory, isApp);
        const relativeWorkspaceRoot = '../'.repeat(projectRoot.split('/').length).slice(0, -1);
        return {
          name,
          root: projectRoot,
          type: isApp ? 'application' : 'library',
          isApp,
          relative: {
            workspaceRoot: relativeWorkspaceRoot,
            dotWorkspace: relativeWorkspaceRoot + '/.workspace',
          },
        };
      }
      projectDirectory.push(dirParts[i]);

    }

    throw new Error(`Invalid project dir: ${dir}`);
  }

  public generateFiles<T extends Record<string, any>>(project: HcNxProjectMeta<any>, srcDir: string, target: string, context?: T) {
    const templateContext = {
      tmpl: '',
      project: project,
      ...context,
    };

    generateFiles(this.tree, srcDir, path.join(project.root, target), templateContext);
  }

  public getCommonProjectFilesDir(subpath: string): string {
    return path.join(path.dirname(__dirname), 'generators/project/files', subpath);
  }

  private addProjectConfiguration(project: HcNxProjectMeta): void {
    addProjectConfiguration(this.tree, project.name, {
      root: project.root,
      projectType: project.type,
      sourceRoot: `${project.root}/src`,
      targets: this.targetHelper.targets(project),
    });
  }

  protected appendLibToWorkspaceTsPaths(project: HcNxProjectMeta) {
    updateJson(this.tree, 'tsconfig.base.json', (v) => {
      v.compilerOptions.paths = v.paths ?? {};
      v.compilerOptions.paths[project.importName] = [`${project.root}/src/index.ts`];
      return v;
    });
  }
}