import { getWorkspaces } from 'bolt';
import chalk from 'chalk';
import * as os from 'os';
import outdent from 'outdent';
import * as path from 'path';
import * as semver from 'semver';
import exec from './lib/exec';

type Change = {
  hash: string;
  message: string;
};
type Changes = Array<Change>;

function sort(a, b) {
  return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' });
}

async function getAddedCommitsFor(workspace): Promise<string> {
  return (await exec('git', [
    'log',
    '--oneline',
    '--diff-filter=A',
    '--',
    path.join(workspace.dir, 'package.json')
  ])).stdout.split('\n');
}

async function getTags() {
  return (await exec('git', ['tag'])).stdout.split('\n');
}

async function getTagsFor(workspace): Promise<Array<string>> {
  const tags = (await getTags()).filter(t => t.indexOf(workspace.name) === 0);
  tags.sort(sort);
  return tags;
}

async function getLatestRefFor(workspace) {
  const tags = await getTagsFor(workspace);
  if (tags.length) {
    return tags[0];
  }

  const refs = await getAddedCommitsFor(workspace);
  return refs[refs.length - 1].split(' ')[0];
}

async function getCommitsSinceRef(ref): Promise<Changes> {
  const diff = (await exec('git', ['log', `${ref}...master`, '--oneline']))
    .stdout;
  return diff
    .split('\n')
    .filter(Boolean)
    .map(d => {
      const [hash, ...rest] = d.split(' ');
      return {
        hash,
        message: rest.join(' ')
      };
    });
}

async function getFilesForCommit(commit) {
  return (await exec('git', [
    'diff-tree',
    '--no-commit-id',
    '--name-only',
    '-r',
    commit
  ])).stdout
    .split('\n')
    .filter(Boolean)
    .map(f => f.replace('/', path.sep));
}

async function getChangesInWorkspace(workspace): Promise<Changes> {
  const ref = await getLatestRefFor(workspace);
  const commits = await getCommitsSinceRef(ref);
  const mapped = await Promise.all(
    commits.map(async c => {
      const files = await getFilesForCommit(c.hash);
      return files.some(f => {
        const relativeWorkspaceDir = path.relative(
          process.cwd(),
          workspace.dir
        );
        return f.indexOf(relativeWorkspaceDir) === 0;
      })
        ? c
        : null;
    })
  );
  return mapped.filter(Boolean);
}

function inferReleaseType(message): 'major' | 'minor' | 'patch' {
  const lc = message.toLowerCase();
  if (lc.includes('breaking')) {
    return 'major';
  }
  if (lc.includes('implements')) {
    return 'minor';
  }
  return 'patch';
}

function calculateReleaseType(changes): 'major' | 'minor' | 'patch' {
  const weight = { major: 2, minor: 1, patch: 0 };
  return changes.reduce((currentWeight, change) => {
    const recommended = inferReleaseType(change.message);
    if (weight[currentWeight] < weight[recommended]) {
      return recommended;
    }
    return currentWeight;
  }, 'patch');
}

async function calculateNextVersion(workspace, changes): Promise<string> {
  const { version } = workspace.config;
  const tags = await getTagsFor(workspace);
  return tags.length || version !== '0.0.0'
    ? semver.inc(version, calculateReleaseType(changes))
    : version;
}

const colors = { major: 'red', minor: 'yellow', patch: 'green' };

function formatChange(color) {
  return change => {
    const releaseType = inferReleaseType(change.message);
    const releaseColor = colors[releaseType];
    const chalkReleaseType = chalk`{${releaseColor} ${releaseType}}`;
    return `  ${change.hash} ${chalkReleaseType} ${change.message}`;
  };
}

export default async function({ pkg }) {
  for (const w of await getWorkspaces()) {
    if (w.config.private || (pkg && pkg !== w.name)) {
      continue;
    }

    const changes = await getChangesInWorkspace(w);
    const nextVersion = await calculateNextVersion(w, changes);

    const releaseType = calculateReleaseType(changes);
    const releaseColor = colors[releaseType];
    const chalkVersion = chalk`{blue ${w.config.version}}`;
    const chalkVersionNext = chalk`{${releaseColor} ${nextVersion}}`;

    console.log(
      outdent`

        ${w.config.name} ${chalkVersion} -> ${chalkVersionNext}
        ${changes.map(formatChange(releaseColor)).join(os.EOL)}
      `
    );
  }
}
