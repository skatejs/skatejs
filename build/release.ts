import { getWorkspaces } from 'bolt';
import * as path from 'path';
import exec from './lib/exec';
import build from './build';

function need(val, msg) {
  if (!val) {
    throw new Error(msg);
  }
}

export default async function release({ pkg, ver }) {
  need(pkg, 'Please specify a package.');
  need(ver, 'Please specify a version number.');

  await build({ pkg });

  const [w] = (await getWorkspaces()).filter(({ name }) => name === pkg);

  if (!w) {
    need(pkg, 'Could not find workspace.');
  }

  const cwd = w.dir;

  await exec(
    'npm',
    ['--allow-same-version', '--no-git-tag-version', 'version', ver],
    { cwd }
  );

  const cur = require(path.join(cwd, 'package.json')).version;
  const tag = `${w.name}-${cur}`;

  await exec('git', ['commit', '-am', tag], { cwd });
  await exec('git', ['tag', '-a', tag, '-m', tag], { cwd });
  await exec('npm', ['publish', '--access', 'public'], { cwd });
  await exec('git', ['push', '--follow-tags']);
}
