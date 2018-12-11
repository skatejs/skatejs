import { getWorkspaces } from 'bolt';

export default async function(name: string) {
  return (await getWorkspaces())
    .filter(w => {
      return name in { ...w.config.dependencies, ...w.config.peerDependencies };
    })
    .map(w => {
      return w.name;
    });
}
