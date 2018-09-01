import { getWorkspaces } from 'bolt';
import * as fs from 'fs-extra';
import * as path from 'path';

export default async function() {
  const corePkg = require(path.join(process.cwd(), 'package.json'));
  const coreTsConfigPath = path.join(process.cwd(), 'tsconfig.json');
  for (const w of await getWorkspaces()) {
    const pkg = Object.keys(w.config)
      .sort()
      .reduce((prev, next) => {
        prev[next] = w.config[next];
        return prev;
      }, {});
    ['author', 'bugs', 'homepage', 'keywords', 'license', 'repository'].forEach(
      key => {
        pkg[key] = corePkg[key];
      }
    );
    await fs.writeFile(
      path.join(w.dir, 'package.json'),
      JSON.stringify(pkg, null, 2)
    );

    const indexTs = path.join(w.dir, 'src', 'index.ts');
    const indexTsx = path.join(w.dir, 'src', 'index.tsx');
    if ((await fs.exists(indexTs)) || (await fs.exists(indexTsx))) {
      const packageTsConfigPath = path.join(w.dir, 'tsconfig.json');
      await fs.copy(coreTsConfigPath, packageTsConfigPath);
    }
  }
}
