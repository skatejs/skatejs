import { getWorkspaces } from 'bolt';
import * as exec from 'execa';
import * as fs from 'fs-extra';
import * as path from 'path';

async function tsc(out, cwd) {
  await fs.remove(out);
  return exec('tsc', ['--module', 'CommonJS', '--outDir', out], { cwd })
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
        w.config.main && tsc(path.dirname(w.config.main), w.dir),
        w.config.module && tsc(path.dirname(w.config.module), w.dir)
      ]);

      if (await fs.exists(tsConfig)) {
        await fs.remove(tsConfig);
      }

      console.log(`Built ${w.config.name}`);
    })
  );
}
