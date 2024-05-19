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
    writeJson(tree, this.packageJsonPath, {
      name: this.options.project.importName,
      type: "commonjs",
      private: true,
      ...this.generateDeps(),
      ...this.generateExports()
    });
  }

  private generateExports(): Record<string, any> {
    return {
      "main": "./src/index.js",
      "types": "./src/index.d.ts",
    };
  }

  private generateDeps(): Record<string, any> {
    return {
      dependencies: {
        'tslib': '2.6.2'
      }
    };
  }
}