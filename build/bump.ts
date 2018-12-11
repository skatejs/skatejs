import { getWorkspaces } from 'bolt';
import { writeJson } from 'fs-extra';
import * as memo from 'memoizee';
import { EOL } from 'os';
import * as path from 'path';
import getDependants from './lib/get-dependants';
import getWorkspace from './lib/get-workspace';

export default async function({ dry, pkg }) {
  const memoGetDependants = memo(getDependants);

  for (const w of await getWorkspaces()) {
    const deps = await memoGetDependants(w.name);

    if (!deps.length) {
      continue;
    }

    let logged = false;
    for (const dep of deps) {
      if (pkg && pkg !== dep) {
        continue;
      }

      if (!logged) {
        logged = true;
        console.log(EOL + w.name);
      }

      const depw = await getWorkspace(dep);
      const depwDeps = depw.config.dependencies;

      if (depwDeps && depwDeps[w.name]) {
        console.log(
          `  ${depw.name}: ${depwDeps[w.name]} -> ${w.config.version}`
        );

        depwDeps[w.name] = w.config.version;

        if (!dry) {
          writeJson(path.join(depw.dir, 'package.json'), depw.config);
        }
      }
    }
  }
}
