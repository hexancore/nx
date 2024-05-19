import {
  Tree,
  updateJson
} from '@nx/devkit';
import * as path from 'path';
import { HcNxHelper } from '../../util/HcNxHelper';
import { ProjectMeta, ProjectPackageJsonGenerator } from '../../util';
import { LibraryGeneratorSchema } from './schema';

export async function libraryGenerator(tree: Tree, options: LibraryGeneratorSchema): Promise<void> {

  const helper = new HcNxHelper(tree);
  const project: ProjectMeta = helper.createProjectMeta(options.directory, false);

  helper.addProjectConfiguration(project);
  ProjectPackageJsonGenerator.run(tree, { project });

  const filesPath = path.join(__dirname, 'files');
  helper.generateProjectFiles(project, path.join(filesPath, 'common'), '');

  updateJson(helper.tree, 'tsconfig.base.json', (v) => {
    v.compilerOptions.paths = v.paths ?? {};
    v.compilerOptions.paths[project.importName] = [`${project.root}/src/index.ts`];
    return v;
  });

  tree.write(path.join(project.root, 'src/index.ts'), 'export const INITIAL = 1;');
  tree.write(path.join(project.root, 'test/helper/.gitkeep'), '');
  tree.write(path.join(project.root, 'test/unit/.gitkeep'), '');
  tree.write(path.join(project.root, 'test/integration/.gitkeep'), '');
  helper.generateProjectFiles(project, path.join(filesPath, 'test'), 'test/unit');
}

export default libraryGenerator;
