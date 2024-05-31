import {
  Tree,
  updateJson
} from '@nx/devkit';

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
      "default": [
        "{projectRoot}/**/*",
        "!{projectRoot}/README.md",
        "sharedGlobals"
      ],
      "sharedGlobals": [],
      production: [
        "default",
        "!{projectRoot}/test/**/*",
        "!{projectRoot}/.vite/**/*",
        "!{projectRoot}/.storybook/**/*",
        "!{projectRoot}/jest.config.{js,ts,mjs,mts}",
        "!{projectRoot}/tsconfig.test.json",
        "!{projectRoot}/.eslintrc.json"
      ]
    };
  }

  private targetDefaults(): Record<string, any> {
    return {
      "@nx/js:tsc": {
        "inputs": ["production", "^production"],
        "outputs": ["{options.outputPath}"],
        "dependsOn": ["^build", "test"],
        "cache": true,
        "options": {
          "outputPath": "dist/{projectRoot}",
          "tsConfig": "{projectRoot}/tsconfig.build.json"
        }
      },

      "@nx/jest:jest": {
        "cache": true,
        "inputs": ["default", "^production", "{workspaceRoot}/jest.preset.js"],
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
      ...this.viteTargetsDefaults(),
      ...this.storybookTargetsDefaults(),
    };
  }

  private viteTargetsDefaults(): Record<string, any> {
    return {
      "@nx/vite:build": {
        "inputs": ["production", "^production"],
        "outputs": ["{options.outputPath}"],
        "defaultConfiguration": "production",
        "options": {
          "outputPath": "dist/{projectRoot}",
          "skipTypeCheck": true,
          "configFile": "{projectRoot}/vite.config.ts",
          "tsConfig": "{projectRoot}/tsconfig.build.json",
          "generatePackageJson": false
        },
        "configurations": {
          "development": {
            "mode": "development"
          },
          "production": {
            "mode": "production"
          }
        }
      },
      "@nx/vite:preview-server": {
        "defaultConfiguration": "development",
        "options": {
          "buildTarget": "build"
        },
        "configurations": {
          "development": {
            "buildTarget": "build:development"
          },
          "production": {
            "buildTarget": "build:production"
          }
        }
      },
      "@nx/vite:test": {
        "cache": true,
        "inputs": ["default", "^default"],
        "options": {
          "configFile": "{projectRoot}/vite.config.ts",
          "passWithNoTests": true,
          "reportsDirectory": "../../../coverage/{projectRoot}"
        },
        "configurations": {
          "watch": {
            "watch": true
          }
        }
      },
    };
  }

  private storybookTargetsDefaults(): Record<string, any> {
    return {
      "@nx/storybook:storybook": {
        "options": {
          "port": 4400,
          "configDir": "libs/front/mao1/.storybook"
        },
        "configurations": {
          "ci": {
            "quiet": true
          }
        }
      },
      "@nx/storybook:build": {
        "outputs": ["{options.outputDir}"],
        "options": {
          "outputDir": "dist/storybook/{projectRoot}",
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
          "staticFilePath": "dist/storybook/{projectRoot}",
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