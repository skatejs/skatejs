# Contributing

PRs are the preferred way to spike ideas and address issues, if you have time.
If you plan on contributing frequently, please feel free to ask to become a
maintainer; the more the merrier.

## Technical overview

We use [Bolt](https://github.com/boltpkg/bolt) to manage our mono-repo. Please
read their docs before proceeding.

* The site can be found in `site/`.
* All packages can be found in `packages/`.

## Getting started

To get started, run `bolt`.

### Tests

To run your tests in watch mode, run:

```
jest --watch
```

To narrow down the tests that are run, you can use the `--testPathPattern`
option:

```
jest --watch --testPathPattern skatejs
```

The above would run only tests that have paths that match `skatejs`, for
example.

### Documentation / website

To document a package or work on the website, run `bolt start`. This will
startup a `webpack-dev-server` and you can dev as normal.

### Other commands

Here are some other commands that you may need to run from time to time, for
whatever reason:

* `bolt build` builds all distributions.
* `bolt flow` invokes the local `flow-bin` dependency.
* `bolt precommit` runs the pre-commit hook.
* `bolt prepare` prepares the packages for publishing.
* `bolt site` compiles the website.
* `bolt test` runs all tests for all packages once.
* `bolt test:js` runs all the unit / integration tests.
* `bolt test:ts` runs all of the TypeScript definition tests.

## Core team

The Skate core team is a group of contributors that have demonstrated a lasting
enthusiasm for the project and community. The core team has admin privileges on
all repos within the org.

### Core team responsibilities

The core team has the following responsibilities:

* Being available to answer high-level questions about Skate's vision and
  future.
* Being available to review longstanding / forgotten pull requests.
* Occasionally check the issues, offer input and assign labels; triage.
* Looking out for up-and-coming members of the Skate community who might want to
  serve as core team members.
* Performing releases.

The core team – and all contributors – are open source _volunteers_; membership
on the core team is expressly _not_ an obligation. The core team is
distinguished as leaders in the community and while they are a good group to
turn to when someone needs an answer to a question, they are still volunteering
their time, and may not be available to help immediately.

### Core team members

The current core team members, ordered by time of addition:

* [@treshugart](https://github.com/treshugart)

### Adding new core team members

The process for adding new core team members is as follows:

* An existing core team member reaches out privately to see if the individual is
  interested. If they are, open a pull request adding them to the list.
* Existing core team members review the pull request. The person merging the PR
  is responsible for adding them to the
  ["Core" GitHub team](https://github.com/orgs/skatejs/teams/core) and for
  adding them as an owner to the npm package. (`npm owner add <npmusername>`)

> Note: If you feel like you have demonstrated a lasting enthusiasm for the
> Skate project and community, yet nobody has reached out to you about joining
> the core team, feel free to ping one of the existing core team members
> _privately_ about the possibility of joining the core team.
