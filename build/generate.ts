import { getWorkspaces } from 'bolt';
import * as fs from 'fs-extra';
import * as path from 'path';

export default async function() {
  const corePkg = require(path.join(__dirname, 'package.json'));
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
  }
}
