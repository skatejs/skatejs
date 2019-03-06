import * as glob from 'glob';
import * as path from 'path';

export default async function() {
  const cwd = process.cwd();
  const pkg = require(path.join(cwd, 'package.json'));
  const workspaces = [];

  for (const workspaceGlob of pkg.workspaces) {
    const workspacePaths = await glob(workspaceGlob);
    for (const workspacePath of workspacePaths) {
      const wsPkg = require(path.join(workspacePath, 'package.json'));
      workspaces.push({
        dir: workspacePath,
        name: wsPkg.name,
        pkg: wsPkg
      });
    }
  }

  return workspaces;
}
