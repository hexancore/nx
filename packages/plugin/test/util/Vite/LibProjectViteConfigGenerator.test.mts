import { LibProjectViteConfigGenerator } from '../../../src/util/Vite/index.mjs';
import { createFakeRuntimeHelper } from '../../helper/functions.js';

describe(LibProjectViteConfigGenerator.constructor.name, () => {

  const runtimeHelper = createFakeRuntimeHelper({
    globs: {},
    readFiles: {
      '/root/package.json': '{name: "@acme-work/source"}'
    }
  });
  const generator = new LibProjectViteConfigGenerator(runtimeHelper);

  test.each([{ mode: 'production' }, { mode: "development" }])('should generate with mode: $mode', ({ mode }) => {
    const current = generator.create({
      workspaceProjectDir: '/root/acme-work/libs/acme-some',
    })({ command: 'build', mode });

    current.plugins = [];

    expect(current).toMatchSnapshot();
  });
});