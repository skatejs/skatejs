import * as memo from 'memoizee';
import * as path from 'path';
import * as semver from 'semver';
import exec from './exec';
import getWorkspace from './get-workspace';

type Change = {
  commits: Array<ChangeCommit>;
  type: Type;
  version: string;
  weight: Weight;
};

type ChangeCommit = Commit & {
  files: Array<string>;
  type: Type;
};

type Commit = {
  hash: string;
  message: string;
};

type Type = 'major' | 'minor' | 'patch';

type Weight = number;

const weights = { major: 2, minor: 1, patch: 0 };

function sort(a, b) {
  return b.localeCompare(a, undefined, { numeric: true, sensitivity: 'base' });
}

const getAddedCommitsFor = memo(async function(name: string): Promise<string> {
  const w = await getWorkspace(name);
  return (await exec('git', [
    'log',
    '--oneline',
    '--diff-filter=A',
    '--',
    path.join(w.dir, 'package.json')
  ])).stdout.split('\n');
});

const getTags = memo(async function() {
  return (await exec('git', ['tag'])).stdout.split('\n');
});

const getTagsFor = memo(async function(name: string): Promise<Array<string>> {
  const tags = (await getTags()).filter(t => t.indexOf(name) === 0);
  tags.sort(sort);
  return tags;
});

const getLatestRefFor = memo(async function(name: string) {
  const tags = await getTagsFor(name);
  if (tags.length) {
    return tags[0];
  }

  const refs = await getAddedCommitsFor(name);
  return refs[refs.length - 1].split(' ')[0];
});

const getLatestCommitsFor = memo(async function(
  name: string
): Promise<Array<Commit>> {
  const ref = await getLatestRefFor(name);
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
});

const getFilesForCommit = memo(async function(commitHash: string) {
  return (await exec('git', [
    'diff-tree',
    '--no-commit-id',
    '--name-only',
    '-r',
    commitHash
  ])).stdout
    .split('\n')
    .filter(Boolean)
    .map(f => f.replace('/', path.sep));
});

async function calculateNextVersion(
  name: string,
  version: string,
  changes: Array<Commit>
): Promise<string> {
  const tags = await getTagsFor(name);
  return tags.length || version !== '0.0.0'
    ? semver.inc(version, calculateReleaseType(changes))
    : version;
}

function calculateReleaseType(changes: Array<Commit>): Type {
  return changes.reduce(
    (currentWeight, change) => {
      const recommended = inferReleaseType(change.message);
      if (weights[currentWeight] < weights[recommended]) {
        return recommended;
      }
      return currentWeight;
    },
    'patch' as Type
  );
}

function inferReleaseType(message): Type {
  const lc = message.toLowerCase();
  if (lc.includes('breaking')) {
    return 'major';
  }
  if (lc.includes('implements')) {
    return 'minor';
  }
  return 'patch';
}

export default async function getChanged(name): Promise<Change> {
  const workspace = await getWorkspace(name);
  const commits = await getLatestCommitsFor(name);
  const releaseType = calculateReleaseType(commits);
  const commitsChanges = [];

  for (const commit of commits) {
    const files = (await getFilesForCommit(commit.hash)).filter(function(f) {
      const relativeWorkspaceDir = path.relative(process.cwd(), workspace.dir);
      return f.indexOf(relativeWorkspaceDir) === 0;
    });

    if (files.length) {
      commitsChanges.push({
        files,
        hash: commit.hash,
        message: commit.message,
        type: inferReleaseType(commit.message)
      });
    }
  }

  return {
    commits: commitsChanges,
    type: releaseType,
    version: await calculateNextVersion(
      name,
      workspace.config.version,
      commits
    ),
    weight: weights[releaseType]
  };
}
