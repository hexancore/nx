import type { ProjectMeta } from "./ProjectMeta";

export interface NxTargetMeta {
  executor: string,
  options?: Record<string, any>;
  configurations?: Record<string, any>;
}

export class HcNxProjectTargetHelper {

  public targets(project: ProjectMeta): Record<string, NxTargetMeta> {
    const targets = {
      lint: this.lint(),
      test: this.test(project),
      build: this.build(project),
    };

    if (project.subtype === 'frontend' && project.type === 'application') {
      targets['preview'] = this.preview();
    }

    if (project.subtype === 'frontend') {
      targets['storybook'] = this.storybook();
      targets['storybook-test'] = this.storybookTest();
      targets['storybook-build'] = this.storybookBuild();
      targets['storybook-static'] = this.storybookStatic();
    }

    return targets;
  }
  public build(project: ProjectMeta): NxTargetMeta {

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

  public lint(): NxTargetMeta {
    return {
      executor: "@nx/eslint:lint",
    };
  }

  public test(project: ProjectMeta): NxTargetMeta {
    if (project.subtype === 'backend' || project.subtype === 'shared') {
      return {
        executor: "@nx/jest:jest",
      };
    }

    return {
      "executor": "@nx/vite:test"
    };
  }

  public preview(): NxTargetMeta {
    return {
      "executor": "@nx/vite:preview-server"
    };
  }

  public storybook(): NxTargetMeta {
    return {
      "executor": "@nx/storybook:storybook",
    };
  }

  public storybookBuild(): NxTargetMeta {
    return {
      "executor": "@nx/storybook:build",
    };
  }

  public storybookTest(): NxTargetMeta {
    return {
      "executor": "nx:run-commands",
    };
  }

  public storybookStatic(): NxTargetMeta {
    return {
      "executor": "@nx/web:file-server",
    };
  }
}