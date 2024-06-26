import {
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { HcNxHelper } from '../../util/HcNxHelper';
import { HcNxProjectMeta } from '../../util';
import { ApplicationGeneratorSchema } from './schema';

export async function applicationGenerator(tree: Tree, options: ApplicationGeneratorSchema): Promise<void> {
  const helper = new HcNxHelper(tree);
  const project: HcNxProjectMeta = helper.project.addApplication(options.directory, options.type);

  helper.project.generateFiles(project, helper.project.getCommonProjectFilesDir(options.type), '');
  helper.project.generateFiles(project, __dirname + `/files/${options.type}`, '');

  tree.write(path.join(project.root, 'test/helper/.gitkeep'), '');
  tree.write(path.join(project.root, 'test/integration/.gitkeep'), '');
}

export default applicationGenerator;
