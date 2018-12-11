import { getWorkspaces } from 'bolt';
import chalk from 'chalk';
import * as os from 'os';
import outdent from 'outdent';
import getChanged from './lib/get-changed';

const colors = { major: 'red', minor: 'yellow', patch: 'green' };

function formatChange(change) {
  const releaseColor = colors[change.type];
  const chalkReleaseType = chalk`{${releaseColor} ${change.type}}`;
  return `  ${change.hash} ${chalkReleaseType} ${change.message}`;
}

export default async function({ explain, pkg }) {
  for (const w of await getWorkspaces()) {
    if (w.config.private || (pkg && pkg !== w.name)) {
      continue;
    }

    const changes = await getChanged(w.name);

    if (!changes.commits.length) {
      continue;
    }

    const releaseType = changes.type;
    const releaseColor = colors[releaseType];
    const chalkVersion = w.config.version;
    const chalkVersionNext = chalk`{${releaseColor} ${changes.version}}`;

    console.log(
      outdent`
        ${w.config.name} ${chalkVersion} -> ${chalkVersionNext}${
        explain ? os.EOL + changes.commits.map(formatChange).join(os.EOL) : ''
      }
      `
    );
  }
}
