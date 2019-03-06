import getWorkspaces from './get-workspaces';

export default async function(
  pkg: string
): Promise<{
  [s: string]: any;
}> {
  const [w] = (await getWorkspaces()).filter(({ name }) => name === pkg);

  if (!w) {
    throw new Error(`Could not find workspace ${pkg}.`);
  }

  return w;
}
