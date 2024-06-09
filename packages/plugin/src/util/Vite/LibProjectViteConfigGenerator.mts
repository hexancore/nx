
import { glob } from 'glob';
import * as path from 'path';
import { BuildOptions, UserConfig, defineConfig, type ConfigEnv, type Plugin, type UserConfigFnObject } from 'vite';
import ViteDtsPlugin from 'vite-plugin-dts';
import { libInjectCss as ViteLibInjectCssPlugin, } from 'vite-plugin-lib-inject-css';

import VuePlugin from '@vitejs/plugin-vue';
import { nxViteTsPaths as ViteNxTsPathsPlugin } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import type { PreRenderedAsset, PreRenderedChunk, RollupOptions } from 'rollup';
import { HcNxProjectHelper } from '../HcNxProjectHelper.js';
import type { HcNxProjectDirectoryMeta, HcNxProjectMeta } from '../HcNxProjectMeta.js';
import { ProjectVitestConfigHelper } from './ProjectVitestConfigHelper.mjs';

import { PrimeVueResolver } from 'unplugin-vue-components/resolvers';
import UnpluginVueComponentsPlugin from 'unplugin-vue-components/vite';
import type { ProjectViteConfigGeneratorOptions } from './ProjectViteConfigGeneratorOptions.mjs';
import { VitePlugins } from './VitePlugins.mjs';
import type { HcNxRuntimeHelper } from '../HcNxRuntimeHelper.js';

export type LibProjectViteMeta = Omit<HcNxProjectMeta, 'type' | 'subtype'>;

export interface LibProjectViteConfigGeneratorOptions extends ProjectViteConfigGeneratorOptions<LibProjectViteConfigGeneratorOptions> {
  plugins?: ProjectViteConfigGeneratorOptions<any>['plugins'] & {
    viteLibInjectCss?: (options: Record<string, any>) => Record<string, any>;
    viteDts?: (options: Parameters<typeof ViteDtsPlugin>[0]) => Parameters<typeof ViteDtsPlugin>[0],
  };
}

export class LibProjectViteConfigGenerator {
  protected vitestHelper: ProjectVitestConfigHelper;

  public constructor(
    private runtimeHelper: HcNxRuntimeHelper,
    vitestHelper?: ProjectVitestConfigHelper
  ) {
    this.vitestHelper = vitestHelper ?? new ProjectVitestConfigHelper();
  }

  public create(options: LibProjectViteConfigGeneratorOptions): UserConfigFnObject {
    options.uiComponentLibrary = options.uiComponentLibrary ?? 'primevue';
    const project = HcNxProjectHelper.getProjectDirectoryMetaFromAbsolute(options.workspaceProjectDir);
    const final = options.final ?? ((config) => config);

    return defineConfig((env: ConfigEnv): UserConfig => {
      const c = {
        root: options.workspaceProjectDir,
        cacheDir: `${project.relative.workspaceRoot}/tmp/vite/${project.name}`,
        plugins: this.plugins(options),
        build: this.build(options, project),
        test: this.vitestHelper.create(project)
      };
      return final(c, options, env);
    });
  }

  private build(options: LibProjectViteConfigGeneratorOptions, project: HcNxProjectDirectoryMeta): UserConfig['build'] {
    return {
      outDir: `${project.relative.workspaceRoot}/dist/${project.root}`,
      emptyOutDir: true,
      cssCodeSplit: true,
      target: 'modules',
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      lib: {
        entry: 'src/index.ts',
        name: project.name,
        fileName: 'index',
        formats: ['es'],
      },
      rollupOptions: this.rollupOptions(options),
    };
  }

  private rollupOptions(options: LibProjectViteConfigGeneratorOptions): BuildOptions['rollupOptions'] {
    const rollupInput = this.rollupInput(options);
    const rollupOutput = this.rollupOutput(options);
    return {
      input: rollupInput,
      output: rollupOutput,
      external: options.rollup?.external ?? ['vue'],
    };
  }

  private rollupInput(options: LibProjectViteConfigGeneratorOptions): RollupOptions['input'] {
    const pattern = options.rollup?.input?.glob ?? '**/*.{ts,vue,tsx,scss,css}';
    const ignorePatterns = options.rollup?.input?.ignorePatterns ?? [/d\.ts|stories\.ts$/];

    const globOptions = {
      posix: true,
      cwd: options.workspaceProjectDir + '/src',
      nodir: true,
    };
    const input = Object.fromEntries(glob.sync(pattern, globOptions)
      .filter((f: string) => ignorePatterns.findIndex((p) => p.test(f)) === -1)
      .map(file => {
        const entryName = file;
        return [entryName, "/src/" + file];
      }));
    return input;
  }

  private rollupOutput(options: LibProjectViteConfigGeneratorOptions): RollupOptions['output'] {
    return {
      format: 'esm',
      globals: {
        vue: 'Vue'
      },
      paths: options.rollup?.output?.paths,
      preserveModules: false,
      manualChunks: (id) => {
        const searchDir = 'src';
        const index = id.indexOf(searchDir);
        id = id.substring(index + searchDir.length + 1);
        if (id.includes('.vue')) {
          const isScript = id.includes("type=script");
          id = id.replace(/\.vue\?.+\./, '.');
          if (isScript) {
            id = id.replace('.ts', '.script.js');
          }
        }
        return id;
      },

      chunkFileNames: (assetInfo: PreRenderedChunk) => {
        return assetInfo.name;
      },
      assetFileNames: (info: PreRenderedAsset): string => {
        return `[name][extname]`;
      },
      entryFileNames: (chunk: PreRenderedChunk) => {
        if (chunk.name.endsWith('.ts')) {
          return chunk.name.replace('.ts', '.js');
        }

        if (chunk.name.endsWith('.vue')) {
          return '[name].js';
        }

        return '[name]';
      }
    };
  }

  private plugins(options: LibProjectViteConfigGeneratorOptions): Plugin[] {
    const plugins = new VitePlugins();
    plugins.set({
      orderIndex: 0,
      id: 'unpluginVueComponents',
      factory: UnpluginVueComponentsPlugin,
      options: {
        dts: 'components.d.ts',
        directives: true,
        resolvers: options.uiComponentLibrary === 'primevue' ? [PrimeVueResolver()] : [],
      }
    });

    plugins.set({
      orderIndex: 1,
      id: 'vue',
      factory: VuePlugin,
      options: {},
    });

    plugins.set({
      orderIndex: 2,
      id: 'viteNxTsPathsPlugin',
      factory: ViteNxTsPathsPlugin,
      options: {}
    });

    plugins.set({
      orderIndex: 3,
      id: 'viteDtsPlugin',
      factory: ViteDtsPlugin,
      options: {
        entryRoot: 'src',
        tsconfigPath: path.join(options.workspaceProjectDir, 'tsconfig.build.json'),
        cleanVueFileName: false,
      }
    });

    plugins.set({
      orderIndex: 4,
      id: 'viteLibInjectCssPlugin',
      factory: ViteLibInjectCssPlugin,
      options: {}
    });

    if (options.plugins) {
      plugins.update(options.plugins);
    }

    return plugins.build();
  }
}