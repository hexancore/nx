import {
  Tree,
  writeJson
} from '@nx/devkit';
import type { ProjectMeta } from './ProjectMeta';

export interface ProjectPackageJsonGeneratorOptions {
  project: ProjectMeta;
}

export class ProjectPackageJsonGenerator<Opts extends ProjectPackageJsonGeneratorOptions> {
  protected packageJsonPath: string;

  public constructor(protected options: Opts) {
    this.packageJsonPath = `${this.options.project.root}/package.json`;
  }

  public static run<Opts extends ProjectPackageJsonGeneratorOptions>(tree: Tree, options: Opts) {
    const g = new this(options);
    g.apply(tree);
  }

  public apply(tree: Tree): void {
    const packageJson = {
      name: this.options.project.importName,
      type: "commonjs",
      private: true,
      ...this.generateDeps(),
      ...this.generateExports()
    };

    if (this.options.project.type === 'library' && this.options.project.subtype === 'frontend') {
      packageJson['sideEffects'] = this.generateSideEffects();
    }

    writeJson(tree, this.packageJsonPath, packageJson);
  }

  private generateExports(): Record<string, any> {
    if (this.options.project.type === 'library') {
      return {
        "main": this.options.project.subtype === 'frontend' ? "./src/index.mjs" : "./src/index.js",
        "types": "./src/index.d.ts",
      };
    }

    if (this.options.project.type === 'application' && this.options.project.subtype === 'backend') {
      return {
        "main": "./src/main.js"
      };
    }

    return {};
  }

  private generateDeps(): Record<string, any> {
    return {
      dependencies: {
        'tslib': '2.6.2'
      }
    };
  }

  private generateSideEffects() {
    return [
      "**/*.css"
    ];
  }
}