import { getWorkspaces } from 'bolt';
import { writeJson } from 'fs-extra';
import * as memo from 'memoizee';
import * as path from 'path';
import * as semver from 'semver';
import getDependants from './lib/get-dependants';
import getWorkspace from './lib/get-workspace';

export default async function() {
  const memoGetDependants = memo(getDependants);

  for (const w of await getWorkspaces()) {
    const deps = await memoGetDependants(w.name);

    for (const dep of deps) {
      const depw = await getWorkspace(dep);
      const depwDeps = depw.config.dependencies;

      if (
        depwDeps &&
        depwDeps[w.name] &&
        !semver.satisfies(w.version, depwDeps[w.name])
      ) {
        console.log(
          depw.name,
          w.name,
          depwDeps[w.name],
          ' -> ',
          w.config.version
        );

        depwDeps[w.name] = w.config.version;

        writeJson(path.join(depw.dir, 'package.json'), depw.config);
      }
    }
  }
}
