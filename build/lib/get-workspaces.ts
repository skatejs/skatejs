import * as glob from 'glob';
import * as path from 'path';

export default async function() {
  const cwd = process.cwd();
  const pkg = require(path.join(cwd, 'package.json'));
  const workspaces = [];

  for (const workspaceGlob of pkg.workspaces) {
    const workspacePaths = glob.sync(workspaceGlob);
    for (const workspacePath of workspacePaths) {
      const wsPkg = require(path.join(cwd, workspacePath, 'package.json'));
      workspaces.push({
        config: wsPkg,
        dir: workspacePath,
        name: wsPkg.name
      });
    }
  }

  return workspaces;
}
