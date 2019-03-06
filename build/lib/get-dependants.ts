import getWorkspaces from './get-workspaces';

export default async function(name: string) {
  return (await getWorkspaces())
    .filter(w => {
      const pkg = w.config;
      return (
        name in
        {
          ...pkg.dependencies,
          ...pkg.devDependencies,
          ...pkg.optionalDependencies,
          ...pkg.peerDependencies
        }
      );
    })
    .map(w => {
      return w.name;
    });
}
