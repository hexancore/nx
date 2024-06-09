import type { TargetConfiguration } from "@nx/devkit";
import type { HcNxProjectMeta } from "./HcNxProjectMeta";


export class HcNxProjectTargetHelper {

  public targets(project: HcNxProjectMeta): Record<string, TargetConfiguration> {
    const targets = {
      lint: this.lint(),
      test: this.test(project),
      build: this.build(project),
    };

    if (project.type === 'application') {
      targets['serve'] = this.serve(project);
      if (project.subtype === 'frontend') {
        targets['preview'] = this.preview();
      }
    }

    if (project.subtype === 'frontend') {
      targets['storybook'] = this.storybook();
      targets['storybook-test'] = this.storybookTest();
      targets['storybook-build'] = this.storybookBuild();
      targets['storybook-static'] = this.storybookStatic();
    }

    return targets;
  }

  public build(project: HcNxProjectMeta): TargetConfiguration {
    if (project.subtype === 'backend' || project.subtype === 'shared') {
      return {
        "executor": "@nx/js:tsc",
        "options": {
          "main": `{projectRoot}/src/${project.type === 'application' ? 'main.ts' : 'index.ts'}`,
        }
      };
    }

    return {
      "executor": "@nx/vite:build"
    };
  }

  public lint(): TargetConfiguration {
    return {
      executor: "@nx/eslint:lint",
    };
  }

  public test(project: HcNxProjectMeta): TargetConfiguration {
    if (project.subtype === 'backend' || project.subtype === 'shared') {
      return {
        executor: "@nx/jest:jest",
      };
    }

    return {
      "executor": "@nx/vite:test"
    };
  }

  public serve(project: HcNxProjectMeta): TargetConfiguration {
    if (project.subtype === 'backend') {
      return {
        "executor": "@nx/js:node",
        "defaultConfiguration": "development",
        "options": {
          "runtimeArgs": [],
          "buildTarget": "build",
          "port": 19002
        }
      };
    }

    return {
      "executor": "@nx/vite:dev-server"
    };
  }

  public preview(): TargetConfiguration {
    return {
      "executor": "@nx/vite:preview-server"
    };
  }

  public storybook(): TargetConfiguration {
    return {
      "executor": "@nx/storybook:storybook",
    };
  }

  public storybookBuild(): TargetConfiguration {
    return {
      "executor": "@nx/storybook:build",
    };
  }

  public storybookTest(): TargetConfiguration {
    return {
      "executor": "nx:run-commands",
    };
  }

  public storybookStatic(): TargetConfiguration {
    return {
      "executor": "@nx/web:file-server",
    };
  }
}