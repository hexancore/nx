import * as path from 'path';
import { defineConfig, type Alias, type BuildOptions, type ConfigEnv, type Plugin, type UserConfig, type UserConfigFnObject } from 'vite';
import { glob } from 'glob';

import { PluginOptions as VueI18nPluginOptions } from '@intlify/unplugin-vue-i18n/types';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { nxViteTsPaths as ViteNxTsPathsPlugin } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import UnpluginVueComponentsPlugin from 'unplugin-vue-components/vite';

import { nodeResolve as RollupNodeResolvePlugin, RollupNodeResolveOptions as RollupNodeResolvePluginOptions } from '@rollup/plugin-node-resolve';
import { default as ViteBasicSslPlugin } from '@vitejs/plugin-basic-ssl';

import VuePlugin from '@vitejs/plugin-vue';
import type { PreRenderedAsset, RollupOptions } from 'rollup';
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers';
import { HcNxProjectHelper } from '../HcNxProjectHelper.js';
import { type HcNxProjectDirectoryMeta } from '../HcNxProjectMeta.js';
import type { ProjectViteConfigGeneratorOptions } from './ProjectViteConfigGeneratorOptions.mjs';
import { ProjectVitestConfigHelper } from './ProjectVitestConfigHelper.mjs';
import { RollupAssetEntryOutput } from './Rollup/RollupAssetEntryOutput.mjs';
import { VitePlugins } from './VitePlugins.mjs';
import { LibAliasResolveViteGenerator } from './LibAliasResolveViteGenerator.mjs';
import type { HcNxRuntimeHelper } from '../HcNxRuntimeHelper.js';

interface RollupOutputFileNamesOptions {
  entryFileNames: string;
  chunkFileNames: string;
  assetFileNames: (info: PreRenderedAsset) => string;
}

export interface AppProjectViteConfigGeneratorOptions extends ProjectViteConfigGeneratorOptions<AppProjectViteConfigGeneratorOptions> {
  plugins?: ProjectViteConfigGeneratorOptions<any>['plugins'] & {
    vueI18n?: (options: VueI18nPluginOptions) => VueI18nPluginOptions;
    rollupNodeResolve: (options: RollupNodeResolvePluginOptions) => RollupNodeResolvePluginOptions;
  };
}

export class AppProjectViteConfigGenerator {
  protected vitestHelper: ProjectVitestConfigHelper;
  protected libAliasResolveGenerator: LibAliasResolveViteGenerator;

  public constructor(
    private runtimeHelper: HcNxRuntimeHelper,
    vitestHelper?: ProjectVitestConfigHelper,
    libAliasResolveGenerator?: LibAliasResolveViteGenerator
  ) {
    this.vitestHelper = vitestHelper ?? new ProjectVitestConfigHelper();
    this.libAliasResolveGenerator = libAliasResolveGenerator ?? new LibAliasResolveViteGenerator();
  }

  public create(options: AppProjectViteConfigGeneratorOptions): UserConfigFnObject {
    options.uiComponentLibrary = options.uiComponentLibrary ?? 'primevue';
    const final = options.final ?? ((config) => config);
    const project = HcNxProjectHelper.getProjectDirectoryMetaFromAbsolute(options.workspaceProjectDir);

    return defineConfig((env: ConfigEnv): UserConfig => {
      const c: UserConfig = {
        root: options.workspaceProjectDir,
        cacheDir: `${project.relative.workspaceRoot}/tmp/vite/${project.name}`,
        resolve: this.resolve(env, options),
        plugins: this.plugins(options),
        build: this.build(options, project),
        test: this.vitestHelper.create(project),
        server: this.server(),
        preview: this.preview(),
      };
      return final(c, options, env);
    });
  }

  protected resolve(configEnv: ConfigEnv, options: AppProjectViteConfigGeneratorOptions): UserConfig['resolve'] {
    const deps: string[] = this.runtimeHelper.getProjectJson(options.workspaceProjectDir)['implicitDependencies'] ?? [];
    if (deps.length === 0) {
      return undefined;
    }

    const projectName2RootMap = this.runtimeHelper.getLibsProjectName2RootMap();
    const projectDirPrefix = this.runtimeHelper.workspaceDir + '/';
    const libsAlias: Alias[] = this.libAliasResolveGenerator.create({
      mode: configEnv.mode as any,
      workspaceDir: this.runtimeHelper.workspaceDir,
      workspacePackageScope: this.runtimeHelper.workspacePackageScope,
      libs: deps.map((name) => {
        const projectRoot = projectName2RootMap.get(name);
        if (!projectRoot) {
          throw new Error('Project root not found by name: ' + name);
        }
        return HcNxProjectHelper.getProjectDirectoryMetaFromAbsolute(projectDirPrefix + projectRoot);
      })
    });
    return {
      alias: libsAlias,
    };
  }

  private plugins(options: AppProjectViteConfigGeneratorOptions): Plugin[] {
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
      id: 'viteNxTsPaths',
      factory: ViteNxTsPathsPlugin,
      options: {}
    });

    plugins.set({
      orderIndex: 3,
      id: 'vueI18n',
      factory: VueI18nPlugin as any,
      options: {
        include: [path.resolve(options.workspaceProjectDir, './src/*/Asset/Locale/**')],
        defaultSFCLang: 'yaml',
        allowDynamic: true,
        dropMessageCompiler: true,
      }
    });

    plugins.set({
      orderIndex: 4,
      id: 'rollupNodeResolve',
      factory: RollupNodeResolvePlugin,
      options: {}
    });

    plugins.set({
      orderIndex: 5,
      id: 'viteBasicSsl',
      factory: ViteBasicSslPlugin as any,
      options: {}
    });

    if (options.plugins) {
      plugins.update(options.plugins);
    }

    return plugins.build();
  }

  protected build(options: AppProjectViteConfigGeneratorOptions, project: HcNxProjectDirectoryMeta): UserConfig['build'] {
    const assetsDir = 'assets';

    return {
      outDir: `${project.relative.workspaceRoot}/dist/${project.root}`,
      reportCompressedSize: true,
      commonjsOptions: { transformMixedEsModules: true },
      minify: true,
      assetsDir,
      emptyOutDir: true,
      rollupOptions: this.rollupOptions(assetsDir, options),
    };
  }

  protected rollupOptions(assetsDir: string, options: AppProjectViteConfigGeneratorOptions): BuildOptions['rollupOptions'] {
    return {
      external: options.rollup?.external ?? ['vue'],
      output: this.rollupOutput(assetsDir, options)
    };
  }

  protected rollupOutput(assetsDir: string, options: AppProjectViteConfigGeneratorOptions): RollupOptions['output'] {
    return {
      format: 'esm',
      paths: options.rollup?.output?.paths,
      ...this.rollupOutputFileNames(assetsDir),
    };
  }

  protected rollupOutputFileNames(assetsDir: string, assetEntryOutputs?: RollupAssetEntryOutput[]): RollupOutputFileNamesOptions {
    assetEntryOutputs = assetEntryOutputs ?? [];
    assetEntryOutputs.push(...[
      {
        regex: /\.(png|jpe?g|gif|svg|webp|avif)$/,
        output: () => `${assetsDir}/img/[name]-[hash][extname]`,
      },
      {
        regex: /\.css$/,
        output: () => `${assetsDir}/css/[name]-[hash][extname]`
      },
      {
        regex: /\.js$/,
        output: () => `${assetsDir}/js/[name]-[hash][extname]`,
      }
    ]);
    return {
      entryFileNames: `${assetsDir}/js/[name]-[hash].js`,
      chunkFileNames: `${assetsDir}/js/[name]-[hash]-chunk.js`,
      assetFileNames: (info: PreRenderedAsset): string => {
        if (info && info.name) {
          const name = info.name as string;
          const result = assetEntryOutputs.find(a => a.regex.test(name));
          if (result) {
            return result.output(info as any);
          }
        }
        return `${assetsDir}/[name]-[hash][extname]`;
      }
    };
  }

  protected server() {
    return {
      port: 20021,
      host: 'localhost',
      fs: {
        strict: false, // Allow serving files from one level up to the project root
      },
    };
  }

  protected preview() {
    return {
      port: 20022,
      host: 'localhost',
    };
  }
}