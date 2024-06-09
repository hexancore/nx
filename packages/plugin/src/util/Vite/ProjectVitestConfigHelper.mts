import type { HcNxProjectDirectoryMeta, HcNxProjectMeta } from '../HcNxProjectMeta.js';
import { UserConfig } from 'vitest';

export type VitestConfig = UserConfig;
export type ProjectVitestMeta = Omit<HcNxProjectMeta, 'type' | 'subtype'>;

export class ProjectVitestConfigHelper {

  public create(project: HcNxProjectDirectoryMeta, final?: (config: UserConfig) => UserConfig): VitestConfig {
    final = final ?? ((config) => config);
    return final({
      globals: true,
      environment: 'jsdom',
      include: ['test/**/*.test.{ts,mts,cts,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: `${project.relative.workspaceRoot}/tmp/coverage/${project.name}`,
        provider: 'v8',
      },
    });
  }
}