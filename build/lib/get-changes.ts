import { getWorkspaces } from 'bolt';
import * as memo from 'memoizee';
import * as semver from 'semver';
import getChanged from './get-changed';
import getDependencies from './get-dependencies';
import getWorkspace from './get-workspace';

type Change = {
  dependents: { [s: string]: Array<string> };
  dependent: boolean;
  name: string;
  self: boolean;
  type: string;
  weight: number;
  version: string;
  versionNext: string;
};

export default async function(): Promise<Array<Change>> {
  const memoGetChanged = memo(getChanged);
  const memoGetDependencies = memo(getDependencies);
  const memoGetWorkspace = memo(getWorkspace);

  const pendingWorkspaces = {};
  const workspaces = await getWorkspaces();

  for (const workspace of workspaces) {
    if (workspace.config.private) {
      continue;
    }

    const changed = await memoGetChanged(workspace.name);
    const pending =
      pendingWorkspaces[workspace.name] ||
      (pendingWorkspaces[workspace.name] = {
        dependents: {},
        dependent: false,
        name: workspace.name,
        self: false,
        type: '',
        weight: 0,
        version: workspace.config.version
      });

    // Updates that happened to the package directly.
    if (changed.commits.length) {
      pending.self = true;

      if (pending.weight < changed.weight) {
        pending.type = changed.type;
        pending.weight = changed.weight;
      }
    }

    const deps = await memoGetDependencies(workspace.name);

    for (const dep of deps) {
      const depWs = await memoGetWorkspace(dep);

      if (depWs.config.private) {
        continue;
      }

      const changed = await memoGetChanged(depWs.name);

      // Updates that happened to dependencies.
      if (changed.commits.length) {
        pending.dependent = true;
        pending.dependents[depWs.name] = 'patch';

        if (pending.weight === 0) {
          pending.type = 'patch';
          pending.weight = 1;
        }
      }
    }
  }

  // Return only ones that have change entries.
  return Object.keys(pendingWorkspaces)
    .map(w => {
      const obj = pendingWorkspaces[w];
      return {
        ...obj,
        versionNext: semver.inc(obj.version, obj.type)
      };
    })
    .filter(w => {
      return w.weight > 0;
    });
}
