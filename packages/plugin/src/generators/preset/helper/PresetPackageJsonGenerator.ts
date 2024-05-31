import {
  addDependenciesToPackageJson,
  updateJson,
  Tree,
  removeDependenciesFromPackageJson,
} from '@nx/devkit';

export class PresetPackageJsonGenerator {

  public constructor(
    private nxVersion: string,
    private hcNxPluginVersion: string
  ) {
  }

  public static run(tree: Tree, options: {
    nxVersion: string,
    hcNxPluginVersion: string;
  }) {
    const g = new this(options.nxVersion, options.hcNxPluginVersion);
    g.apply(tree);
  }

  public apply(tree: Tree): void {
    this.generateDeps(tree);

    updateJson(tree, 'package.json', (o) => {
      o.license = 'UNLICENSED';
      o.scripts = o.scripts ?? {};

      o.scripts['prepare'] = "node .husky/install.mjs";
      o.scripts['precommit'] = "nx run-many --targets=lint,test,build";
      o.scripts['ci'] = "nx run-many --targets=lint,test,build,e2e --configuration=ci";
      return o;
    });
  }

  private generateDeps(tree: Tree): void {
    const deps = this.deps();
    const devDeps = this.devDeps();
    removeDependenciesFromPackageJson(tree, ['@hexancore/nx'], []);
    addDependenciesToPackageJson(tree, deps, devDeps);
  }

  private deps(): Record<string, string> {
    const hexancore = {
      '@hexancore/core': '0.14.*',
      '@hexancore/common': '0.13.*',
      '@hexancore/cloud': '0.1.*',
      '@hexancore/auth': '0.3.*',
      '@hexancore/typeorm': '0.14.*',
    };

    return {
      ...hexancore,
      'tslib': '2.6.2',
      'fs-extra': '^11.2.0',
      'reflect-metadata': '^0.1.13',
    };
  }

  private devDeps(): Record<string, string> {
    return {
      ...this.hexancoreDevDeps(),
      ...this.nxDevDeps(),
      ...this.frontendDevDeps(),
      ...this.jestDevDeps(),
      ...this.eslintDevDeps(),
      ...this.essentialsDevDeps()
    };
  }

  private nxDevDeps(): Record<string, string> {
    return {
      "@nx/esbuild": this.nxVersion,
      "@nx/eslint-plugin": this.nxVersion,
      "@nx/jest": this.nxVersion,
      "@nx/js": this.nxVersion,
      "@nx/vite": this.nxVersion,
      "@nx/vue": this.nxVersion,
      "@nx/linter": this.nxVersion,
      "@nx/storybook": this.nxVersion,
      "@nx/web": this.nxVersion,
    };
  }

  private hexancoreDevDeps(): Record<string, string> {
    return {
      "@hexancore/nx": this.hcNxPluginVersion,
      "@hexancore/mocker": "^1.1.2",
    };
  }

  private frontendDevDeps(): Record<string, string> {
    const vue = {
      "@vue/eslint-config-typescript": "^11.0.3",
      "@vue/eslint-config-prettier": "^7.1.0",
      "@vue/test-utils": "^2.4.5",
      "@vue/tsconfig": "^0.4.0",
      "vue": "^3.4.25",
      "vue-eslint-parser": "^9.4.2",
      "vue-router": "^4.3.2",
      "pinia": "^2.1.7",
      "vue-tsc": "^1.8.27",
      "vee-validate": "^4.12.6",
    };

    const vueI18n = {
      "vue-i18n": "^9.13.1",
      "@intlify/eslint-plugin-vue-i18n": "^2.0.0",
      "@intlify/unplugin-vue-i18n": "^4.0.0",
      "unplugin-swc": "^1.4.5",
    };

    const vite = {
      "@vitejs/plugin-basic-ssl": "^1.1.0",
      "@vitejs/plugin-vue": "^5.0.4",
      "@vitest/coverage-v8": "1.6.*",
      "@vitest/ui": "1.6.*",
      "vitest": "1.6.*",
      "@rollup/plugin-node-resolve": "^15.2.3",
      "rollup": "^4.17.0",
      "vite": "^5.2.10",
      "vite-tsconfig-paths": "^4.3.2",
      "autoprefixer": "^10.4.19",
      "@babel/core": "^7.24.4",
      "@babel/plugin-transform-modules-commonjs": "^7.24.1",
      "@babel/preset-env": "^7.24.4",
      "vite-plugin-lib-inject-css": "2.1.1",
      "vite-plugin-dts": "3.9.1",
    };

    const primevue = {
      "primeflex": "^3.3.1",
      "primeicons": "^7.0.0",
      "primevue": "^3.52.0",
    };

    const style = {
      "postcss": "^8.4.38",
      "sass": "^1.75.0",
      "stylelint": "^16.6.0",
      "stylelint-config-standard": "^36.0.0",
      "@samatech/postcss-basics": "^0.6.0",
    };

    return {
      ...vue,
      ...vueI18n,
      ...vite,
      ...primevue,
      ...style,
      ...this.storybookDevDeps()
    };
  }

  private storybookDevDeps(): Record<string, string> {
    const storybookVersion = "^8.1.5";
    return {
      "@storybook/addon-essentials": storybookVersion,
      "@storybook/addon-interactions": storybookVersion,
      "@storybook/core-server": storybookVersion,
      "@storybook/test": storybookVersion,
      "@storybook/vue3": storybookVersion,
      "@storybook/vue3-vite": storybookVersion,
      "storybook": storybookVersion,
    };
  }

  private eslintDevDeps(): Record<string, string> {
    return {
      "eslint": "8.57.0",
      "eslint-plugin-import": "^2.29.1",
      "eslint-plugin-vue": "^9.25.0",
      "@typescript-eslint/parser": "^7.10.0",
      "@stylistic/eslint-plugin": "^2.1.0",
    };
  }

  private jestDevDeps(): Record<string, string> {
    return {
      "happy-dom": "^14.11.0",
      "jest": "^29.7.0",
      "jest-docblock": "^29.7.0",
      "jest-environment-jsdom": "^29.7.0",
      "jest-environment-node": "^29.7.0",
      "jest-expect-message": "^1.1.3",
      "jest-runner": "^29.7.0",
      "jest-runner-groups": "^2.2.0",
      "jsdom": "^24.0.0",
      "ts-jest": "^29.1.2",
      "@types/jest": "^29.5.12",
      "@jest/globals": "^29.7.0",
    };
  }

  public essentialsDevDeps(): Record<string, string> {
    return {
      "tsconfig": "^7.0.0",
      "typescript": "5.4.5",
      "typescript-transform-paths": "^3.4.7",
      "esbuild": "^0.19.12",
      "axios-mock-adapter": "^1.22.0",
      "@types/node": "20.12.12",
      "@nestjs/testing": "^10.3.8",
      "husky": "^9.0.11",
      "prettier": "3.2.5"
    };
  }
}