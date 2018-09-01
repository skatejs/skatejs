import { getWorkspaces } from 'bolt';
import exec from 'execa';
import * as fs from 'fs-extra';
import * as path from 'path';

export default async function({ pkg }) {
  const ws = await getWorkspaces();
  await Promise.all(
    ws.map(async w => {
      if (pkg && !w.config.name.match(new RegExp(pkg))) {
        return;
      }

      const indexTs = path.join(w.dir, 'src', 'index.ts');
      const indexTsx = path.join(w.dir, 'src', 'index.tsx');
      const tsConfig = path.join(w.dir, 'tsconfig.json');

      if (!await fs.exists(indexTs) && !await fs.exists(indexTsx)) {
        return;
      }

      if (!await fs.exists(tsConfig)) {
        await fs.copy('tsconfig.json', tsConfig);
      }

      if (w.config.main) {
        const result1 = await exec(
          'tsc',
          ['--module', 'CommonJS', '--outDir', path.dirname(w.config.main)],
          {
            cwd: w.dir
          }
        )
          .catch(e => e)
          .then(r => r.stdout);
      }

      if (w.config.module) {
        const result1 = await exec(
          'tsc',
          ['--module', 'ES2015', '--outDir', path.dirname(w.config.module)],
          {
            cwd: w.dir
          }
        )
          .catch(e => e)
          .then(r => r.stdout);
      }
      console.log(w.config.name);
    })
  );
}
