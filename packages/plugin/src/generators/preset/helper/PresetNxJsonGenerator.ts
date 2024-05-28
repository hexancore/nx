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

      o.namedInputs = o.namedInputs ?? {};
      o.namedInputs = {
        "default": [
          "{projectRoot}/**/*",
          "sharedGlobals"
        ],
        "sharedGlobals": [],
      };
      o.namedInputs.production = [
        "default",
        "!{projectRoot}/jest.config.{js,ts,mjs,mts}",
        "!{projectRoot}/vite.config.{js,ts,mjs,mts}",
        "!{projectRoot}/.eslintrc.json"
      ];

      o.targetDefaults = {
        "build": {
          "inputs": ["default", "!{projectRoot}/test/**/*"],
          "dependsOn": ["^build"],
          "cache": true
        },
        "lint": {
          "inputs": [
            "default",
            "{workspaceRoot}/.eslintrc.json",
            "{workspaceRoot}/.eslintignore"
          ],
          "cache": true
        },
        "lint-fix": {
          "cache": false
        },
        "test": {
          "inputs": [
            "default",
            "^default",
            "{workspaceRoot}/jest.preset.js"
          ],
          "cache": true
        },
        "test-watch": {
          "inputs": ["default", "^default", "{workspaceRoot}/jest.preset.js"],
          "cache": true
        },
        "@nx/vite:test": {
          "cache": true,
          "inputs": [
            "default",
            "^default"
          ]
        },
        "@nx/eslint:lint": {
          "inputs": [
            "default",
            "{workspaceRoot}/.eslintrc.json",
            "{workspaceRoot}/.eslintignore"
          ],
          "cache": true
        }
      };

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
}