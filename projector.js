const { getWorkspaces } = require('bolt');
const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');

function exec(...args) {
  return execa(...args)
    .then(r => console.log(r.stdout))
    .catch(console.log);
}

async function babel({ envs }) {
  for (const w of await getWorkspaces()) {
    for (const env of envs.split(',')) {
      if ((w.config.files || []).indexOf(`dist/${env}`) === -1) continue;
      const src = path.join(w.dir, 'src');
      const dst = path.join(w.dir, 'dist', env);
      exec('babel', [src, '--out-dir', dst], {
        env: { BABEL_ENV: env }
      }).then(() =>
        exec('flow-copy-source', [
          '-i',
          '**/__tests__/**',
          'src',
          `dist/${env}`
        ])
      );
    }
  }
}

const need = (val, msg) => {
  if (!val) {
    throw new Error(msg);
  }
};

async function release({ packages, type }) {
  need(packages, 'Please specify at least one package.');
  need(type, 'Please specify a release type (or version number).');
  const ws = await getWorkspaces();
  for (const pkg of packages.split(',')) {
    const name = pkg.trim();
    const w = ws.filter(w => w.name === name)[0];
    if (!w) continue;
    const cwd = w.dir;
    await exec('npm', ['--no-git-tag-version', 'version', type], { cwd });
    const ver = require(path.join(cwd, 'package.json')).version;
    const tag = `${name}-${ver}`;
    await exec('git', ['commit', '-am', tag]);
    await exec('git', ['tag', '-am', tag]);
  }
  await exect('git', ['push']);
}

module.exports = {
  babel,
  release
};
