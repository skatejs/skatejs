import { getWorkspaces } from 'bolt';
import parallel from './lib/parallel';

export default async function() {
  parallel(() => require('fs-extra').remove('./site/public'));
  for (const w of await getWorkspaces()) {
    parallel(w.dir, async dir => {
      const fs = require('fs-extra');
      const path = require('path');
      const toRemove = path.relative(process.cwd(), path.join(dir, 'dist'));
      await fs.remove(toRemove);
      return toRemove;
    }).then(console.log);
  }
}
