import { getWorkspaces } from 'bolt';

type Dependent = {
  types: Array<Type>;
  workspace: { [s: string]: any };
};

type Type =
  | 'dependency'
  | 'devDependency'
  | 'optionalDependency'
  | 'peerDependency';

export default async function(pkg: string): Promise<Array<Dependent>> {
  return (await getWorkspaces())
    .map(workspace => {
      const {
        dependencies,
        devDependencies,
        optionalDependencies,
        peerDependencies
      } = workspace.config;
      const types = [];

      if (pkg in dependencies) {
        types.push('dependencies');
      }

      if (pkg in devDependencies) {
        types.push('devDependencies');
      }

      if (pkg in optionalDependencies) {
        types.push('optionalDependencies');
      }

      if (pkg in peerDependencies) {
        types.push('peerDependencies');
      }

      return {
        types,
        workspace
      };
    })
    .filter(({ types }) => types.length > 0);
}
