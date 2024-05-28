export class HcNxProjectTargetHelper {

  public buildTarget(options: {main: string}) {
    return {
      "executor": "@nx/js:tsc",
      "outputs": [
        "{options.outputPath}"
      ],
      "options": {
        "outputPath": "dist/{projectRoot}",
        "main": `{projectRoot}/src/${options.main}`,
        "tsConfig": "{projectRoot}/tsconfig.build.json"
      }
    };
  }

  public lintTarget(options: { fix?: boolean; }) {
    return {
      executor: "@nx/eslint:lint",
      options: {
        lintFilePatterns: [
          "{projectRoot}/**/*.ts",
          "{projectRoot}/package.json"
        ],
        ...options
      }
    };
  }

  public testTarget(options: { watch?: boolean; }) {
    return {
      executor: "@nx/jest:jest",
      defaultConfiguration: "test",
      options: {
        jestConfig: "{projectRoot}/jest.config.ts",
        runInBand: true,
        passWithNoTests: true,
        ...options,
      }
    };
  }

}