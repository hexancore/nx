import {
  Tree,
  updateJson,
  type TargetConfiguration
} from '@nx/devkit';

export type ProjectTargetsConfiguration = Record<string, TargetConfiguration>;

export class PresetNxJsonGenerator {

  public static run(tree: Tree) {
    const g = new this();
    g.apply(tree);
  }

  public apply(tree: Tree): void {
    updateJson(tree, 'nx.json', (o) => {
      o.extends = 'nx/presets/npm.json';
      o.pluginsConfig = {
        "@nx/js": {
          "analyzeSourceFiles": true
        }
      };

      o.namedInputs = { ...(o.namedInputs ?? {}), ...this.namedInputs() };
      o.targetDefaults = { ...(o.targetDefaults ?? {}), ...this.targetDefaults() };
      o.generators = {
        "@nx/workspace:move": {
          "projectNameAndRootFormat": "as-provided"
        }
      };
      o.useInferencePlugins = false;
      o.defaultBase = 'main';

      o['workspaceLayout'] = {
        "appsDir": "apps",
        "libsDir": "libs"
      };

      return o;
    });
  }

  private namedInputs(): Record<string, any> {
    return {
      default: [
        "{projectRoot}/**/*",
        "sharedGlobals"
      ],
      sharedGlobals: [],
      production: [
        "default",
        "!{projectRoot}/test/**/*",
        "!{projectRoot}/jest.config.{js,ts,mjs,mts}",
        "!{projectRoot}/tsconfig.test.json",
        "!{projectRoot}/.eslintrc.json",
        "{workspaceRoot}/.workspace/vite/**/*"
      ],
      storybook: [
        "production",
        "{projectRoot}/**/*.stories.ts",
        "{workspaceRoot}/.workspace/storybook/**/*",
      ]
    };
  }

  private targetDefaults(): ProjectTargetsConfiguration {
    return {
      ...this.jsTargetsDefaults(),
      ...this.eslintTargetsDefaults(),
      ...this.jestTargetsDefaults(),
      ...this.viteTargetsDefaults(),
      ...this.storybookTargetsDefaults(),
    };
  }

  private jsTargetsDefaults(): ProjectTargetsConfiguration {
    return {
      "@nx/js:tsc": {
        cache: true,
        "inputs": ["production", "^production"],
        "outputs": ["{options.outputPath}"],
        "dependsOn": ["^build", "test"],
        "options": {
          "outputPath": "{workspaceRoot}/dist/{projectRoot}",
          "tsConfig": "{projectRoot}/tsconfig.build.json",
          "transformers": [
            {
              "name": "typescript-transform-paths/nx-transformer"
            }
          ]
        }
      }
    };
  }

  private eslintTargetsDefaults(): ProjectTargetsConfiguration {
    return {
      "@nx/eslint:lint": {
        "inputs": ["default", "{workspaceRoot}/.eslintrc.json", "{workspaceRoot}/.eslintignore"],
        "cache": true,
        "options": {
          "lintFilePatterns": ["{projectRoot}/**/*.ts", "{projectRoot}/package.json"]
        },
        "configurations": {
          "fix": {
            "fix": true,
            "cache": false
          }
        }
      },
    };
  }

  private jestTargetsDefaults(): ProjectTargetsConfiguration {
    return {
      "@nx/jest:jest": {
        "cache": true,
        "inputs": ["default", "{workspaceRoot}/.workspace/jest/**/*"],
        "options": {
          "jestConfig": "{projectRoot}/jest.config.ts",
          "runInBand": true,
          "passWithNoTests": true
        },
        "configurations": {
          "watch": {
            "watch": true
          },
          "ci": {
            "ci": true,
            "codeCoverage": true
          },
          "updateSnapshot": {
            "updateSnapshot": true
          },
          "codeCoverage": {
            codeCoverage: true,
          }
        }
      },
    };
  }

  private viteTargetsDefaults(): ProjectTargetsConfiguration {
    return {
      "@nx/vite:build": {
        cache: true,
        "inputs": ["production", "^production"],
        outputs: ["{options.outputPath}"],
        defaultConfiguration: "production",
        options: {
          "outputPath": "dist/{projectRoot}",
          "skipTypeCheck": true,
          "configFile": "{projectRoot}/vite.config.mts",
          "tsConfig": "{projectRoot}/tsconfig.build.json",
          "generatePackageJson": false
        },
        configurations: {
          development: {
            "mode": "development"
          },
          production: {
            "mode": "production"
          }
        }
      },
      "@nx/vite:preview-server": {
        defaultConfiguration: "development",
        cache: false,
        options: {
          "buildTarget": "build"
        },
        configurations: {
          development: {
            buildTarget: "build:development"
          },
          production: {
            buildTarget: "build:production"
          }
        }
      },
      "@nx/vite:dev-server": {
        cache: false,
        defaultConfiguration: "development",
        options: {
          buildTarget: "build"
        },
        configurations: {
          development: {
            buildTarget: "build:development"
          },
          production: {
            buildTarget: "build:production"
          }
        }
      },
      "@nx/vite:test": {
        cache: true,
        inputs: ["default"],
        options: {
          configFile: "{projectRoot}/vite.config.mts",
          passWithNoTests: true,
          reportsDirectory: "{workspaceRoot}/coverage/{projectRoot}"
        },
        configurations: {
          watch: {
            watch: true
          }
        }
      },
    };
  }

  private storybookTargetsDefaults(): ProjectTargetsConfiguration {
    return {
      "@nx/storybook:storybook": {
        "cache": false,
        "options": {
          "port": 4400,
          "configDir": "{projectRoot}/.storybook"
        },
        "configurations": {
          "ci": {
            "quiet": true
          }
        }
      },
      "@nx/storybook:build": {
        "inputs": ["storybook"],
        "cache": true,
        "outputs": ["{options.outputDir}"],
        "options": {
          "outputDir": "{workspaceRoot}/dist/storybook/{projectRoot}",
          "configDir": "{projectRoot}/.storybook"
        },
        "configurations": {
          "ci": {
            "quiet": true
          }
        }
      },
      "storybook-test": {
        "executor": "nx:run-commands",
        "options": {
          "command": "test-storybook -c {projectRoot}/.storybook --url=http://localhost:4400"
        }
      },
      "storybook-static": {
        "executor": "@nx/web:file-server",
        "options": {
          "buildTarget": "storybook-build",
          "staticFilePath": "{workspaceRoot}/dist/storybook/{projectRoot}",
          "spa": true
        },
        "configurations": {
          "ci": {
            "buildTarget": "storybook-build:ci"
          }
        }
      }
    };
  }
}