import { getWorkspaces } from 'bolt';
import * as fs from 'fs-extra';
import * as path from 'path';

type Pkg = {
  browser: string;
  esnext: string;
  main: string;
  module: string;
  source: string;
};

const pkgDefault = {
  source: 'src/index.ts'
};

const regexTsSuffix = /\.tsx?$/;

export default async function() {
  const corePkg = require(path.join(process.cwd(), 'package.json'));
  for (const w of await getWorkspaces()) {
    let pkg = { ...pkgDefault, ...w.config };
    pkg = Object.keys(pkg)
      .sort()
      .reduce((prev, next) => {
        prev[next] = pkg[next];
        return prev;
      }, {}) as Pkg;

    // Copy these from the main package.json.
    ['author', 'bugs', 'homepage', 'keywords', 'license', 'repository'].forEach(
      key => {
        pkg[key] = corePkg[key];
      }
    );

    // If using TypeScript, we automate the output, otherwise just use the source.
    if (pkg.source) {
      if (pkg.source.match(regexTsSuffix)) {
        pkg.browser = 'module/index.js';
        pkg.esnext = 'esnext/index.js';
        pkg.main = 'main/index.js';
        pkg.module = 'module/index.js';
      } else {
        delete pkg.browser;
        delete pkg.esnext;
        delete pkg.module;
        pkg.main = pkg.source;
      }
    }

    await fs.writeFile(
      path.join(w.dir, 'package.json'),
      JSON.stringify(pkg, null, 2)
    );
  }
}
