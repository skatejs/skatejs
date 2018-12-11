import { getWorkspaces } from 'bolt';
import getWorkspace from './get-workspace';

export default async function(name): Promise<Array<string>> {
  const w = await getWorkspace(name);
  const ws = (await getWorkspaces()).map(w => w.name);
  const deps = { ...w.config.dependencies, ...w.config.peerDependencies };
  return ws.filter(w => w in deps);
}
