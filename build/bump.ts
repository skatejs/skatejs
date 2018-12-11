import getDependents from './lib/get-dependents';
import getWorkspace from './lib/get-workspace';
import { writeJson } from 'fs-extra';
import * as path from 'path';
import * as semver from 'semver';

export default async function({ pkg, ver }: { pkg: string; ver: string }) {
  const dependents = await getDependents(pkg);
  const workspace = await getWorkspace(pkg);
  const pkgPath = path.join(workspace.dir, 'package.json');
  const pkgJson = require(pkgPath);
  const newVersion =
    typeof ver[0] === 'number'
      ? ver
      : semver.inc(pkgJson.version, ver as semver.ReleaseType);

  // Update the current version.
  pkgJson.version = newVersion;
  await writeJson(pkgPath, pkgJson);

  return Promise.all(
    dependents.map(async dependent => {
      // Skip the current workspace.
      if (dependent.workspace.name === workspace.name) {
        return;
      }

      const dependentPkgPath = path.join(
        dependent.workspace.dir,
        'package.json'
      );
      const dependentPkgJson = require(dependentPkgPath);

      // Update all dependency fields.
      for (const type in dependent.types) {
        dependentPkgJson[type][dependent.workspace.name] = `^${newVersion}`;
      }

      // Write new package versions.
      return writeJson(dependentPkgPath, dependentPkgJson);
    })
  );
}
