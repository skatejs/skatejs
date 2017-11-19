# Contributing

## Technical overview

Skate's source is kept in `src/`. It is written using the latest ES2017 version,
with Flow type definitions.

When Skate is built, it is transpiled in to various distribution formats, ready
for use in the browser, on a server, or in a webpack build.

The documentation for Skate is kept in `site/`, and is written using Skate with
server-side rendering.

Unit tests exist both for the source and for the documentation examples.

## Getting started

Skate uses `npm` as its package manager. Ensure you're on `npm@5` at a minimum.

Here are the main commands you'll need while developing:

* Creating a bundle: `npm prepublish`
* Developing with tests: `npm run test:watch`
* Updating skate site: `npm run dev`
* Fixing whole project code format via prettier: `npm run format`
* Updating Typescript definitions ( if you've changed anything make sure all TS
  test pass ): `npm run test:ts`

## Making a change

All changes to Skate should be include an accompanying test case to demonstrate
the feature or bug being addressed.

## Committing

// @TODO

## Pull Requests

Pull requests should be issued for even the smallest change. Every pull request
should have at least one corresponding issue.

## Releasing

// @TODO

## Notes

* Default branch should always be the latest stable branch.
