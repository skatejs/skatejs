import * as exec from 'execa';
import * as fs from 'fs-extra';
import * as path from 'path';
import getWorkspaces from './lib/get-workspaces';

async function tsc(out, cwd, optModule, optTarget) {
  await fs.remove(out);
  return exec(
    'tsc',
    ['--module', optModule, '--outDir', out, '--target', optTarget],
    { cwd }
  )
    .catch(e => e)
    .then(r => r.stdout);
}

const mainTsConfigJson = require(path.join('..', 'tsconfig.json'));

export default async function({ pkg }) {
  const ws = await getWorkspaces();
  await Promise.all(
    ws.map(async w => {
      if (pkg && pkg !== w.name) {
        return;
      }

      const indexTs = path.join(w.dir, 'src', 'index.ts');
      const indexTsx = path.join(w.dir, 'src', 'index.tsx');
      const tsConfig = path.join(w.dir, 'tsconfig.json');

      if (!(await fs.exists(indexTs)) && !(await fs.exists(indexTsx))) {
        return;
      }

      if (!(await fs.exists(tsConfig))) {
        await fs.writeJson(tsConfig, {
          ...mainTsConfigJson,
          exclude: ['**/__tests__/**'],
          include: ['src']
        });
      }

      await Promise.all([
        w.config.esnext &&
          tsc(path.dirname(w.config.esnext), w.dir, 'esnext', 'esnext'),
        w.config.main &&
          tsc(path.dirname(w.config.main), w.dir, 'commonjs', 'es5'),
        w.config.module &&
          tsc(path.dirname(w.config.module), w.dir, 'es2015', 'es5')
      ]);

      if (await fs.exists(tsConfig)) {
        await fs.remove(tsConfig);
      }

      console.log(`Built ${w.config.name}`);
    })
  );
}
