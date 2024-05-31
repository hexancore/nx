import { existsSync } from "fs";
import { execNx, getTestWorkspaceRoot } from "./functions";

export default () => {
  if (global.stopLocalRegistry) {
    global.stopLocalRegistry();
  }

  const workspaceRoot = getTestWorkspaceRoot();
  if (existsSync(workspaceRoot)) {
    execNx(workspaceRoot, 'reset');
  }
};

