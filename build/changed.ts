import { getWorkspaces } from 'bolt';
import chalk from 'chalk';
import * as os from 'os';
import outdent from 'outdent';
import * as path from 'path';
import semver from 'semver';
import exec from './lib/exec';

type Change = {
  hash: string;
  message: string;
};
type Changes = Array<Change>;

async function getTags() {
  return (await exec('git', ['tag'])).stdout.split('\n');
}

async function getTagsFor(name) {
  return (await getTags()).filter(t => t.indexOf(name) === 0);
}

async function getLatestTagFor(name) {
  const tags = await getTagsFor(name);
  return tags.length ? tags[tags.length - 1] : null;
}

async function getCommitsSinceTag(tag): Promise<Changes> {
  const diff = (await exec('git', ['log', `${tag}...master`, '--oneline']))
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
  const latestTag = await getLatestTagFor(workspace.name);
  if (latestTag) {
    const commits = await getCommitsSinceTag(latestTag);
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
  return [];
}

function inferReleaseType(message) {
  const lc = message.toLowerCase();
  if (lc.includes('breaking')) {
    return 'major';
  }
  if (lc.includes('implements')) {
    return 'minor';
  }
  return 'patch';
}

function calculateReleaseType(changes) {
  const weight = { major: 2, minor: 1, patch: 0 };
  return changes.reduce((currentWeight, change) => {
    const recommended = inferReleaseType(change.message);
    if (currentWeight < weight[recommended]) {
      return weight[recommended];
    }
    return currentWeight;
  }, 'patch');
}

function calculateNextVersion(version, changes) {
  return semver.inc(version, calculateReleaseType(changes));
}

export default async function() {
  for (const w of await getWorkspaces()) {
    const changes = await getChangesInWorkspace(w);
    if (changes.length) {
      console.log(
        outdent`
            ${w.config.name} ${chalk`{green ${
          w.config.version
        }}`} -> ${chalk`{yellow ${calculateNextVersion(
          w.config.version,
          changes
        )}}`}
              ${changes
                .map(
                  d =>
                    `${d.hash} ${chalk`{yellow ${inferReleaseType(
                      d.message
                    )}}`} ${d.message}`
                )
                .join(`${os.EOL}  `)}
          `
      );
    }
  }
}
