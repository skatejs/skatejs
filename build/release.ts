import { getWorkspaces } from 'bolt';
import path from 'path';
import exec from './lib/exec';
import build from './build';

function need(val, msg) {
  if (!val) {
    throw new Error(msg);
  }
}

async function release({ packages, type }) {
  need(packages, 'Please specify at least one package.');
  need(type, 'Please specify a release type (or version number).');
  await exec('bolt', ['build']);
  const ws = await getWorkspaces();
  for (const pkg of packages.split(',')) {
    await build({ pkg });
    const name = pkg.trim();
    const w = ws.filter(w => w.name === name)[0];
    if (!w) continue;
    const cwd = w.dir;
    await exec('npm', ['--no-git-tag-version', 'version', type], { cwd });
    const ver = require(path.join(cwd, 'package.json')).version;
    const tag = `${name}-${ver}`;
    await exec('git', ['commit', '-am', tag], { cwd });
    await exec('git', ['tag', '-a', tag, '-m', tag], { cwd });
    await exec('npm', ['publish'], { cwd });
  }
  await exec('git', ['push', '--follow-tags']);
}
