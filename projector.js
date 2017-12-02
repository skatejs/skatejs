const { getWorkspaces } = require('bolt');
const execa = require('execa');
const path = require('path');

function exec(...args) {
  return execa(...args)
    .then(r => console.log(r.stdout))
    .catch(console.log);
}

async function babel({ envs }) {
  for (const w of await getWorkspaces()) {
    for (const env of envs.split(',')) {
      if ((w.config.files || []).indexOf(env) === -1) continue;
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

module.exports = {
  babel
};
