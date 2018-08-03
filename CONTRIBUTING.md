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

To document a package or work on the website, run `bolt dev`. This will start up
a `webpack-dev-server` and you can dev as normal.

### Releasing

Releasing is restricted to those with NPM access. If you have access there's a couple commands that will help you.

To determine what needs to be released you can run `projector changes`. You can then run `projector release` to release the packages at your specified type.

If you want to release a `patch` version of `skatejs`, you can run `projector release --packages skatejs --type patch`.

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
