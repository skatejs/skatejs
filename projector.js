const { promisify } = require('util');
const { getWorkspaces } = require('bolt');
const execa = require('execa');
const path = require('path');
const rmrf = promisify(require('rimraf'));

function exec(...args) {
  return execa(...args)
    .then(r => console.log(r.stdout))
    .catch(console.log);
}

async function copyTsConfig(w) {
  return exec('cp', [
    '-rf',
    'tsconfig.json',
    path.join(w.dir, 'tsconfig.json')
  ]);
}

async function runTsc(w) {
  return exec('tsc', ['-p', w.dir]);
}

async function babel({ envs }) {
  for (const w of await getWorkspaces()) {
    for (const env of envs.split(',')) {
      if ((w.config.files || []).indexOf(env) === -1) continue;
      const src = path.join(w.dir, 'src');
      const dst = path.join(w.dir, 'dist', env);
      await exec('babel', [src, '--out-dir', dst], {
        env: { BABEL_ENV: env }
      });
      await exec('flow-copy-source', [
        '-i',
        '**/__tests__/**',
        'src',
        `dist/${env}`
      ]);
    }
  }
}

async function ts() {
  for (const w of await getWorkspaces()) {
    if ((w.config.files || []).indexOf('ts') === -1) continue;
    await copyTsConfig(w);
    await runTsc(w);
    await rmrf(path.join(w.dir, 'tsconfig.json'));
  }
}

module.exports = {
  babel,
  ts
};
