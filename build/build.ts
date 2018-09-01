import { getWorkspaces } from 'bolt';
import parallel from './lib/parallel';

export default async function({ pkg }) {
  const ws = await getWorkspaces();
  await Promise.all(
    ws.map(async w => {
      if (pkg && !w.config.name.match(new RegExp(pkg))) {
        return;
      }

      await parallel(w.dir, w.config, async (dir, pkg) => {
        const exec = require('execa');
        const fs = require('fs-extra');
        const path = require('path');
        const indexTs = path.join(dir, 'src', 'index.ts');
        const indexTsx = path.join(dir, 'src', 'index.tsx');
        const tsConfig = path.join(dir, 'tsconfig.json');

        if (!await fs.exists(indexTs) && !await fs.exists(indexTsx)) {
          return;
        }

        if (!await fs.exists(tsConfig)) {
          await fs.copy('tsconfig.json', tsConfig);
        }

        if (pkg.main) {
          const result1 = await exec(
            'tsc',
            ['--module', 'CommonJS', '--outDir', path.dirname(pkg.main)],
            {
              cwd: dir
            }
          )
            .catch(e => e)
            .then(r => r.stdout);
        }

        if (pkg.module) {
          const result1 = await exec(
            'tsc',
            ['--module', 'ES2015', '--outDir', path.dirname(pkg.module)],
            {
              cwd: dir
            }
          )
            .catch(e => e)
            .then(r => r.stdout);
        }
      });
      console.log(w.config.name);
    })
  );
}
