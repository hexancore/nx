import { AppProjectViteConfigGenerator } from '../../../src/util/Vite/index.mjs';
import { createFakeRuntimeHelper } from '../../helper/functions.js';

describe(AppProjectViteConfigGenerator.constructor.name, () => {
  const runtimeHelper = createFakeRuntimeHelper({
    globs: {
      '**/project.json': ['acme/dep/project.json']
    },
    readFiles: {
      '/root/package.json': '{"name": "@acme-work/source"}',
      '/root/acme-work/apps/acme-some/project.json': '{"implicitDependencies": ["acme-dep"]}'
    }
  });
  const generator = new AppProjectViteConfigGenerator(runtimeHelper);

  test.each([{ mode: 'production' }, { mode: "development" }])('should generate with mode: $mode', ({ mode }) => {
    const current = generator.create({
      workspaceProjectDir: '/root/acme-work/apps/acme-some',
    })({ command: 'build', mode });

    current.plugins = [];

    expect(current).toMatchSnapshot();
  });
});