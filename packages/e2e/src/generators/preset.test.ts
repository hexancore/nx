import { existsSync } from 'fs';
import { join } from 'path';
import { getTestWorkspaceRoot } from '../helper/functions';

describe('Preset', () => {
  const workspaceRoot = getTestWorkspaceRoot();

  test('should be installed', () => {
    expect(existsSync(join(workspaceRoot, 'package.json'))).toBeTruthy();
  });
});

