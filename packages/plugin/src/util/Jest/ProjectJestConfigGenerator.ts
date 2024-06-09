import { pathsToModuleNameMapper, type JestConfigWithTsJest } from 'ts-jest';
import { HcNxProjectHelper } from '../HcNxProjectHelper';
import { readFileSync } from 'fs';

export interface ProjectJestConfigGeneratorOptions {
  workspaceProjectDir: string;
  final?: (config: JestConfigWithTsJest) => JestConfigWithTsJest;
}

export class ProjectJestConfigGenerator {

  public create(options: ProjectJestConfigGeneratorOptions): JestConfigWithTsJest {
    const project = HcNxProjectHelper.getProjectDirectoryMetaFromAbsolute(options.workspaceProjectDir);

    const tsConfig = JSON.parse(readFileSync(`${options.workspaceProjectDir}/tsconfig.json`, 'utf-8'));
    const jestConfig: JestConfigWithTsJest = {
      extensionsToTreatAsEsm: ['.ts'],
      displayName: project.name,
      resolver: '@nx/jest/plugins/resolver',
      transform: {
        '^.+\\.m?[tj]sx?$': ['ts-jest', { tsconfig: `${options.workspaceProjectDir}/tsconfig.test.json` }],
      },
      runner: "groups",
      moduleFileExtensions: ["js", "json", "ts"],
      moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths),
      testMatch: ["<rootDir>/test/**/*.test.ts"],
      setupFiles: [],
      setupFilesAfterEnv: ["jest-expect-message", "<rootDir>/test/config.ts"],
      coverageDirectory: `${project.relative.workspaceRoot}/tmp/coverage/${project.name}`,
      testEnvironment: "node",
      transformIgnorePatterns: ["/node_modules/"]
    };

    return jestConfig;
  }
}