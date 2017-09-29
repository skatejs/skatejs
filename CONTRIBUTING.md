# Contributing

## Technical overview

Skate's source is kept in `src/`. It is written using the latest ES2017 version, with Flow type definitions.

When Skate is built, it is transpiled in to various distribution formats, ready for use
in the browser, on a server, or in a webpack build.

The documentation for Skate is kept in `site/`, and is written using Skate with server-side rendering.

Unit tests exist both for the source and for the documentation examples.

## Getting started

Skate uses `npm` as its package manager. Ensure you're on `npm@5` at a minimum.

Here are the main commands you'll need while developing:

- Creating a bundle: `npm prepublish`
- Developing with tests: `npm run test:watch`
- Fixing js and ts code style: `npm run style:fix`
- Commiting (with commitizen): `npm run commit`

## Making a change

All changes to Skate should be include an accompanying test case to demonstrate the feature or bug being addressed.

## Committing

We are using semantic-release and conventional-changelog for releasing, so our commit messages have to follow strict rules.

The commit message formatting can be added using a typical git workflow or through the use of a CLI wizard ([Commitizen](https://github.com/commitizen/cz-cli)).

To use the wizard, run `npm run commit` in your terminal after staging your changes in git.

A detailed explanation can be found in this [document](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#).

## Pull Requests

Pull requests should be issued for even the smallest change. Every pull request should have at least one corresponding issue.

## Releasing

Skate uses semantic-release and conventional-changelog so releases are published automatically.

## Notes

- Default branch should always be the latest stable branch.
