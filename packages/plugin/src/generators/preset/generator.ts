import {
  Tree,
  formatFiles,
  generateFiles,
  installPackagesTask
} from '@nx/devkit';
import * as path from 'path';
import { HcNxHelper } from '../../util/HcNxHelper';
import { PresetNxJsonGenerator } from './helper/PresetNxJsonGenerator';
import { PresetPackageJsonGenerator } from './helper/PresetPackageJsonGenerator';
import { PresetGeneratorSchema } from './schema';
import { readFileSync } from 'fs';

export async function presetGenerator(
  tree: Tree,
  options: PresetGeneratorSchema
) {

  const nxVersion = HcNxHelper.pluginNxVersion;
  const hcNxPluginVersion = HcNxHelper.pluginVersion;

  PresetPackageJsonGenerator.run(tree, { nxVersion, hcNxPluginVersion });
  PresetNxJsonGenerator.run(tree);

  const templateContext = {
    tmpl: '',
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
  generateFiles(tree, path.join(filesPath, 'bin'), './bin', templateContext);

  await formatFiles(tree);

  return () => {
    installPackagesTask(tree, true, undefined, 'pnpm');
  };
}

export default presetGenerator;
