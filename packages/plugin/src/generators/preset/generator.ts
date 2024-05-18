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
import { readFileSync } from 'fs';

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
  const filesPath = path.join(__dirname, 'files');
  tree.write('.vscode/extensions.json', readFileSync(path.join(filesPath, 'vscode/extensions.json')));
  tree.write('.vscode/settings.json.template', readFileSync(path.join(filesPath, 'vscode/settings.json')));
  generateFiles(tree, path.join(filesPath, './.husky'), './.husky', templateContext);
  generateFiles(tree, path.join(filesPath, 'workspace'), './', templateContext);

  await formatFiles(tree);
}

export default presetGenerator;
