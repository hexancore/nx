import {
  Tree,
  generateFiles,
  installPackagesTask
} from '@nx/devkit';
import * as path from 'path';
import { HcNxHelper } from '../../util/HcNxHelper';
import { PresetNxJsonGenerator } from './helper/PresetNxJsonGenerator';
import { PresetPackageJsonGenerator } from './helper/PresetPackageJsonGenerator';
import { PresetGeneratorSchema } from './schema';

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
      packageScope: `@${options.name}`,
      name: options.name,
      nxVersion
    }
  };
  const filesPath = path.join(__dirname, 'files');
  generateFiles(tree, path.join(filesPath, 'workspace'), './', templateContext);

  return () => {
    installPackagesTask(tree, true, undefined, 'pnpm');
  };
}

export default presetGenerator;
