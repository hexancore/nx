import { StorybookConfig } from '@storybook/vue3-vite';

export interface ProjectStorybookConfigGeneratorOptions {
  workspaceProjectDir: string;
  staticDirs?: StorybookConfig['staticDirs'];
  final?: (config: StorybookConfig) => StorybookConfig;
}

export class ProjectStorybookConfigGenerator {

  public create(options: ProjectStorybookConfigGeneratorOptions): StorybookConfig {
    const config: StorybookConfig = {
      stories: ['../src/**/*.stories.@(ts|tsx)'],
      staticDirs: options.staticDirs,
      addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
      core: {
        disableTelemetry: true,
        builder: '@storybook/builder-vite',
      },
      framework: {
        name: '@storybook/vue3-vite',
        options: {
          docgen: 'vue-component-meta',
          builder: {
            viteConfigPath: `${options.workspaceProjectDir}/vite.config.mts`,
          },
        },
      },

      docs: {},
      viteFinal: async (config) => {
        const { mergeConfig } = await import('vite');
        return mergeConfig(config, {
          build: {
            chunkSizeWarningLimit: 900
          }
        });
      },
    };

    const final = options.final ?? ((config) => config);
    return final(config);
  }
}