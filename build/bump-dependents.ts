import getDependents from './lib/get-dependents';
import getWorkspace from './lib/get-workspace';
import { writeJson } from 'fs-extra';
import * as path from 'path';

export default async function({ pkg }: { pkg: string }) {
  const dependents = await getDependents(pkg);
  const workspace = await getWorkspace(pkg);

  return Promise.all(
    dependents.map(async dependent => {
      // Skip the current workspace.
      if (dependent.workspace.name === workspace.name) {
        return;
      }

      const pkgPath = path.join(workspace.dir, 'package.json');
      const pkgJson = require(pkgPath);

      // Update all dependency fields.
      for (const type in dependent.types) {
        pkgJson[type][workspace.name] = `^${workspace.config.version}`;
      }

      // Write new package versions.
      return writeJson(pkgPath, pkgJson);
    })
  );
}
