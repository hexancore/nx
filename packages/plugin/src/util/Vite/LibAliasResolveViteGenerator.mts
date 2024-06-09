import type { Alias } from "vite";
import type { HcNxProjectDirectoryMeta, HcNxProjectMeta } from "../HcNxProjectMeta.js";
import { extname } from "path";
import { existsSync } from "fs";

export interface LibAliasResolveViteGeneratorOptions {
  workspaceDir: string;
  mode: 'development' | 'production';
  workspacePackageScope: string,
  libs: HcNxProjectDirectoryMeta[],
  productionExtensionMapping?: Record<string, string>;
}

export const DEFAULT_PRODUCTION_EXTENSION_MAPPING = {
  '.scss': 'css',
  '.vue': 'vue.js',
};

export class LibAliasResolveViteGenerator {

  public create(options: LibAliasResolveViteGeneratorOptions) {
    const srcDir = (options.mode === 'development') ? `${options.workspaceDir}/libs` : `${options.workspaceDir}/dist/libs`;
    options.productionExtensionMapping = options.productionExtensionMapping ?? DEFAULT_PRODUCTION_EXTENSION_MAPPING;
    return options.libs.map((lib) => this.createAlias(options as any, srcDir, lib));
  }

  protected createAlias(options: Required<LibAliasResolveViteGeneratorOptions>, srcDir: string, project: HcNxProjectDirectoryMeta): Alias {
    return {
      find: new RegExp(`^${options.workspacePackageScope}\/${project.name}\/(.*)$`),
      replacement: (options.mode === 'development') ? `${srcDir}/${project.root}/src/$1` : `${srcDir}/${project.root}/$1`,
      customResolver(source, importer, resolverOptions) {

        // in dev mode use src files and default resolvers
        if (options.mode === 'development') {
          return this.resolve(source, importer, resolverOptions);
        }

        const ext = extname(source);
        if (ext === '') {
          const indexFile = source + '/index.js';
          if (existsSync(indexFile)) {
            return indexFile;
          } else {
            return source + '.js';
          }
        }

        const distExt = options.productionExtensionMapping[ext] ?? ext;
        const out = source.slice(0, -(ext.length - 1)) + distExt;
        return out;
      },
    };
  }
}