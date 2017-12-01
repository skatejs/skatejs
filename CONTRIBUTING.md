# Contributing

## Technical overview

We use [Bolt](https://github.com/boltpkg/bolt) to manage our mono-repo. Please
read their docs before proceeding.

* The site can be found in `site/`.
* All packages can be found in `packages/`.

## Getting started

To get started, run `bolt`.

### Documentation / website

To document a package or work on the website, run `bolt dev`. This will start up
a `webpack-dev-server` and you can dev as normal.

### tests

To run the tests for normal development, you'll want to do that in watch mode:
`bolt test:watch`.

### Other commands

Here are some other commands that you may need to run from time to time, for
whatever reason:

* `bolt build` builds all distributions.
* `bolt build:[type]` build the distribution for the corresponding `[type]`.
* `bolt flow` invokes the local `flow-bin` dependency.
* `bolt precommit` runs the pre-commit hook.
* `bolt prepare` prepares the packages for publishing.
* `bolt site` compiles the website.
* `bolt test` runs all tests for all packages once.
* `bolt test:ts` checks the typescript definitions.

## Workflow

You may develop how you like, but the code you write should have accompanying
tests.
