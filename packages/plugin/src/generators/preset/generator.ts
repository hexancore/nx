import {
  Tree,
  formatFiles,
  generateFiles
} from '@nx/devkit';
import * as path from 'path';
import { HcNxHelper } from '../../util/NxHelper';
import { PresetNxJsonGenerator } from './helper/PresetNxJsonGenerator';
import { PresetPackageJsonGenerator } from './helper/PresetPackageJsonGenerator';
import { PresetGeneratorSchema } from './schema';

export async function presetGenerator(
  tree: Tree,
  options: PresetGeneratorSchema
) {

  const nxVersion = HcNxHelper.getPluginNxVersion();
  const hcNxPluginVersion = HcNxHelper.getVersion();

  PresetPackageJsonGenerator.run(tree, { nxVersion, hcNxPluginVersion });
  PresetNxJsonGenerator.run(tree);

  tree.delete('.prettierrc');
  const templateContext = {
    workspace: {
      name: options.name,
      nxVersion
    }
  };
  generateFiles(tree, path.join(__dirname, 'files', 'workspace', '.vscode'), './.vscode', templateContext);
  generateFiles(tree, path.join(__dirname, 'files', 'workspace', './.husky'), './.husky', templateContext);
  generateFiles(tree, path.join(__dirname, 'files', 'workspace'), './', templateContext);

  await formatFiles(tree);
}

export default presetGenerator;
