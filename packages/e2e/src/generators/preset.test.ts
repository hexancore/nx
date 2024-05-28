import { existsSync } from 'fs';
import { join } from 'path';

import { createTestWorkspace } from '../helper/functions';

describe('Preset', () => {
  let workspaceRoot: string;

  test('should be installed', () => {
    workspaceRoot = createTestWorkspace('preset-test');
    
    expect(existsSync(join(workspaceRoot, 'package.json'))).toBeTruthy();
  });
});

