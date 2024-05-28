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
import { ProjectMeta, type ApplicationProjectMeta, type LibraryProjectMeta } from './ProjectMeta';
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
    const project = this.createProjectMeta<ApplicationType>(directory, true, type);
    this.addProjectConfiguration(project);
    ProjectPackageJsonGenerator.run(this.tree, { project });
    return project;
  }

  public addLibrary(directory: string, type: LibraryType): LibraryProjectMeta {
    const project = this.createProjectMeta<LibraryType>(directory, false, type);
    this.addProjectConfiguration(project);
    this.appendLibToWorkspaceTsPaths(project);
    ProjectPackageJsonGenerator.run(this.tree, { project });
    return project;
  }

  private createProjectMeta<T extends ApplicationType | LibraryType>(directory: string, isApp: boolean, type: T): ProjectMeta<T> {
    const name = HcNxProjectHelper.getProjectNameFromDirectory(directory, isApp);
    const projectRoot = HcNxProjectHelper.getProjectRoot(directory, isApp);
    return {
      name,
      root: projectRoot,
      workspaceRootRelative: '../'.repeat(projectRoot.split('/').length),
      importName: this.helper.workspacePackageNamespace + '/' + name,
      type: isApp ? 'application' : 'library',
      subtype: type
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

  public generateFiles<T extends Record<string, any>>(project: ProjectMeta<any>, srcDir: string, target: string, context?: T) {
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

  private addProjectConfiguration(project: ProjectMeta): void {
    addProjectConfiguration(this.tree, project.name, {
      root: project.root,
      projectType: project.type,
      sourceRoot: '{projectRoot}/src',
      targets: {
        build: this.targetHelper.buildTarget({ main: project.type === 'application' ? 'main.ts' : 'index.ts' }),
        lint: this.targetHelper.lintTarget({}),
        "lint-fix": this.targetHelper.lintTarget({ fix: true }),
        test: this.targetHelper.testTarget({}),
        'test-watch': this.targetHelper.testTarget({ watch: true }),
      }
    });
  }

  protected appendLibToWorkspaceTsPaths(project: ProjectMeta) {
    updateJson(this.tree, 'tsconfig.base.json', (v) => {
      v.compilerOptions.paths = v.paths ?? {};
      v.compilerOptions.paths[project.importName] = [`${project.root}/src/index.ts`];
      return v;
    });
  }
}