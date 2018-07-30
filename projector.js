// @flow

const { getWorkspaces } = require('bolt');
const chalk = require('chalk');
const charm = require('charm')(process.stdin, process.stdout);
const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');

function exec(...args) {
  return execa(...args).catch(console.log);
}

function need(val, msg) {
  if (!val) {
    throw new Error(msg);
  }
}

charm.goto = function(pos /*: 'start' | 'end' */) {
  return this[pos === 'start' ? 'left' : 'right'](100000);
};

async function babel({ envs } /* : { envs: string } */) {
  need(envs, 'Please specify at least one environment.');

  const envArr = envs
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  const ws = await getWorkspaces();
  ws.sort((a, b) => a.name.localeCompare(b.name));

  for (const w of ws) {
    const files = w.config.files || [];
    const wname = w.name.replace('@', '');

    charm.write(chalk`\n{white ${wname}}`);

    if (!envArr.every(e => files.some(f => f.match(e)))) {
      charm.goto('start').write(chalk`{gray ${wname}}`);
      continue;
    }

    // Clean up any old build.
    await fs.remove(path.join(w.dir, 'dist'));

    for (const env of envArr) {
      charm.write(chalk` {yellow ${env}...}`);

      if (!files.some(f => f.match(env))) {
        charm
          .left(env.length + 3)
          .write(chalk`{cyan ${env}}`)
          .right(3)
          .erase('end');
        continue;
      }

      const src = path.join(w.dir, 'src');
      const dst = path.join(w.dir, 'dist', env);

      await Promise.all([
        exec('flow-copy-source', [
          '-i',
          '**/__tests__/**',
          'src',
          `dist/${env}`
        ]),
        exec('babel', [src, '--out-dir', dst], {
          env: { BABEL_ENV: env }
        })
      ]);

      charm
        .left(env.length + 3)
        .write(chalk`{green ${env}}`)
        .erase('end');
    }
  }
  charm.write('\n\n').end();
}

async function release(
  { packages, type } /*: { packages: string, type: string } */
) {
  need(packages, 'Please specify at least one package.');
  need(type, 'Please specify a release type (or version number).');
  await exec('bolt', ['build']);
  const ws = await getWorkspaces();
  for (const pkg of packages.split(',')) {
    const name = pkg.trim();
    const w = ws.filter(w => w.name === name)[0];
    if (!w) continue;
    const cwd = w.dir;
    await exec('npm', ['--no-git-tag-version', 'version', type], { cwd });
    // $FlowFixMe - require string literal
    const ver = require(path.join(cwd, 'package.json')).version;
    const tag = `${name}-${ver}`;
    await exec('git', ['commit', '-am', tag], { cwd });
    await exec('git', ['tag', '-a', tag, '-m', tag], { cwd });
    await exec('npm', ['publish', '--access', 'public'], { cwd });
  }
  await exec('git', ['push']);
}

module.exports = {
  babel,
  release
};
