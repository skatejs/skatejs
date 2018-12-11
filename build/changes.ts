import getChanges from './lib/get-changes';

export default async function() {
  const changes = await getChanges();
  for (const change of changes) {
    console.log(change);
  }
}
