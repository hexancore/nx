import { Tree } from '@nx/devkit';
import { applicationGenerator } from '../../../src/generators/application/applicationGenerator';
import type { ApplicationGeneratorSchema } from '../../../src/generators/application/schema';
import { createEmptyNxTree, exceptWorkspaceFileMatchSnapshot, expectedFiles } from '../../helper/functions';

describe('Application Generator: Frontend', () => {
  let tree: Tree;
  const type = 'frontend';
  const projectDirectory = `acme/${type}`;
  const projectRoot = `apps/${projectDirectory}`;
  beforeAll(async () => {
    tree = createEmptyNxTree();
    const options: ApplicationGeneratorSchema = { directory: projectDirectory, type };
    await applicationGenerator(tree, options);
  });

  const expectedProjectSrcFiles = expectedFiles(`${projectRoot}/src/`, [
    'constants.ts',
    'Core/Asset/Image/logo.png',
    'Core/Asset/Locale/en.yaml',
    'Core/Asset/Style/colors.module.css',
    'Core/Asset/Style/font.scss',
    'Core/Asset/Style/style.css',
    'Core/Asset/Style/theme.css',
    'Core/Asset/Style/theme.dark.css',
    'Core/Asset/Style/theme.light.css',
    'Core/Asset/Style/tokens.css',
    'Core/Asset/Style/typography.module.css',
    'Core/Asset/Style/variables.scss',
    'Core/Component/Layout/AppLayout.vue',
    'Core/Component/Misc/AppLogo.vue',
    'Core/Component/View/App.vue',
    'Core/Component/View/CoreRoutes.ts',
    'Core/Component/View/Dashboard.vue',
    'Core/Component/View/Error/404.vue',
    'Core/Service/Plugin/I18NCorePlugin.ts',
    'Core/Service/Plugin/PiniaCorePlugin.ts',
    'Core/Service/Plugin/PrimeVueCorePlugin.ts',
    'Core/Service/Router/Router.ts',
    'env.d.ts',
    'shims-vue.d.ts'
  ]);

  const expectedProjectFilesToMatchSnapshots = expectedFiles(`${projectRoot}/`, [
    'README.md',
    'project.json',
    '.eslintrc.json',
    'tsconfig.json',
    'tsconfig.test.json',
    'tsconfig.build.json',
    'tsconfig.storybook.json',
    'src/main.ts',
    '.storybook/main.ts',
    '.storybook/preview.ts',
    'vite.config.mts',
    '.env.development',
    'index.html'
  ]);

  const expectedWorkspaceFilesToMatchSnapshots = [
    ...expectedProjectFilesToMatchSnapshots,
    '.prettierrc',
    'package.json',
    'nx.json',
    'tsconfig.base.json',
  ];

  test.each(expectedWorkspaceFilesToMatchSnapshots.map(i => [i]))('%s should match snapshot', (filePath) => {
    exceptWorkspaceFileMatchSnapshot(tree, filePath);
  });

  test('only file from list should exist', () => {
    const expectedWorkspaceFilesToExists = [
      `${projectRoot}/test/helper/.gitkeep`,
      `${projectRoot}/test/unit/sample.test.ts`,
      `${projectRoot}/test/integration/.gitkeep`,
      ...expectedWorkspaceFilesToMatchSnapshots,
      ...expectedProjectSrcFiles,
      `${projectRoot}/public/favicon.ico`,
    ];
    const diff = tree.listChanges().map(c => c.path).filter(x => !expectedWorkspaceFilesToExists.includes(x));
    expect(diff).toEqual([]);
  });
});
