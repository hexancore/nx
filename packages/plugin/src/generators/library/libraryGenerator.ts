import {
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { HcNxHelper } from '../../util/HcNxHelper';
import { ProjectMeta } from '../../util';
import { LibraryGeneratorSchema } from './schema';

export async function libraryGenerator(tree: Tree, options: LibraryGeneratorSchema): Promise<void> {
  const helper = new HcNxHelper(tree);
  const project: ProjectMeta = helper.project.addLibrary(options.directory, options.type);

  if (options.type !== 'shared') {
    helper.project.generateFiles(project, helper.project.getCommonProjectFilesDir(options.type), '');
  }
  helper.project.generateFiles(project, __dirname + `/files/${options.type}`, '');

  tree.write(path.join(project.root, 'src/index.ts'), 'export const INITIAL = 1;');
  tree.write(path.join(project.root, 'test/helper/.gitkeep'), '');
  tree.write(path.join(project.root, 'test/integration/.gitkeep'), '');
}

export default libraryGenerator;
