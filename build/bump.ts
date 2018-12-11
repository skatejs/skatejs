import { getWorkspaces } from 'bolt';
import { writeJson } from 'fs-extra';
import * as memo from 'memoizee';
import { EOL } from 'os';
import * as path from 'path';
import getDependants from './lib/get-dependants';
import getWorkspace from './lib/get-workspace';

function logOnce() {
  let logged = false;
  return (...args) => {
    if (!logged) {
      logged = true;
      console.log(...args);
    }
  };
}

function updateVersion(wName, wVersion, depwDeps) {
  if (depwDeps && depwDeps[wName] && depwDeps[wName] !== wVersion) {
    depwDeps[wName] = wVersion;
  }
}

export default async function({ dry, pkg }) {
  const memoGetDependants = memo(getDependants);

  for (const w of await getWorkspaces()) {
    const wName = w.name;
    const wVersion = w.config.version;
    const deps = await memoGetDependants(w.name);

    if (!deps.length) {
      continue;
    }

    const logger = logOnce();
    for (const dep of deps) {
      if (pkg && pkg !== dep) {
        continue;
      }

      const depw = await getWorkspace(dep);
      const depwConf = depw.config;
      const depwDeps = depwConf.dependencies;
      const depwDevs = depwConf.devDependencies;
      const depwOpts = depwConf.optionalDependencies;
      const depwPeer = depwConf.peerDependencies;
      const depwMerged = { ...depwDeps, ...depwDevs, ...depwOpts, ...depwPeer };

      updateVersion(wName, wVersion, depwDeps);
      updateVersion(wName, wVersion, depwDevs);
      updateVersion(wName, wVersion, depwOpts);
      updateVersion(wName, wVersion, depwPeer);

      if (depwMerged[wName] !== wVersion) {
        logger(EOL + wName);
        console.log(`  ${depw.name}: ${depwMerged[wName]} -> ${wVersion}`);
      }

      if (!dry) {
        writeJson(path.join(depw.dir, 'package.json'), depwConf);

        const mainPkgPath = path.join(process.cwd(), 'package.json');
        const mainPkgJson = require(mainPkgPath);

        updateVersion(wName, wVersion, mainPkgJson.dependencies);
        updateVersion(wName, wVersion, mainPkgJson.devDependencies);
        updateVersion(wName, wVersion, mainPkgJson.optionalDependencies);
        updateVersion(wName, wVersion, mainPkgJson.peerDependencies);
        writeJson(mainPkgPath, mainPkgJson);
      }
    }
  }
}
