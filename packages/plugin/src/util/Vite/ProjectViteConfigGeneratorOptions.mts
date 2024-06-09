import { Options as VuePluginOptions } from '@vitejs/plugin-vue';
import { nxViteTsPathsOptions } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { Options as UnpluginVueComponentsPluginOptions } from 'unplugin-vue-components/types';

import { UserConfig, type ConfigEnv } from 'vite';

import type { HcNxProjectMeta } from '../HcNxProjectMeta.js';
import type { RollupAssetEntryOutput } from './Rollup/RollupAssetEntryOutput.mjs';
import { VitePlugins } from './VitePlugins.mjs';
import type { OptionsPaths, RollupOptions } from 'rollup';

export type LibProjectViteMeta = Omit<HcNxProjectMeta, 'type' | 'subtype'>;

export interface ProjectViteConfigGeneratorOptions<ChildOptions> {
  workspaceProjectDir: string,
  uiComponentLibrary?: 'primevue' | 'none',
  rollup?: {
    external?: RollupOptions['external'];
    input?: {
      glob?: string,
      ignorePatterns?: RegExp[];
    },
    output?: {
      assetEntryOutputs?: RollupAssetEntryOutput[];
      paths?: OptionsPaths;
    };
  };
  plugins?: {
    unpluginVueComponents?: (options: UnpluginVueComponentsPluginOptions) => UnpluginVueComponentsPluginOptions;
    vue?: (options: VuePluginOptions) => VuePluginOptions;
    viteNxTsPaths?: (options: nxViteTsPathsOptions) => nxViteTsPathsOptions,
    all?: (plugins: VitePlugins) => void;
  };
  final?: (config: UserConfig, options: ChildOptions, env: ConfigEnv) => UserConfig;
}