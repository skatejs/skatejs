# Contributing

- Creating a bundle: `npm prepublish`
- Working on docs: `npm run docs:watch` / `yarn docs:watch`
- Developing with tests: `npm run test:watch` / `yarn test:watch`
- Fixing js and ts code style: `npm run style:fix` / `yarn style:fix`
- Commiting (with commitizen): `npm run commit` / `yarn commit`

## Committing

We are using semantic-release and conventional-changelog for releasing, so our commit messages have to follow strict rules.

The commit message formatting can be added using a typical git workflow or through the use of a CLI wizard ([Commitizen](https://github.com/commitizen/cz-cli)).

To use the wizard, run `npm run commit` or `yarn commit` in your terminal after staging your changes in git.

A detailed explanation can be found in this [document](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#).

## Pull Requests

Pull requests should be issued for even the smallest change. Every pull request should have at least one corresponding issue.

## Releasing

Skate uses semantic-release and conventional-changelog so releases are published automatically.

## Notes

- Default branch should always be the latest stable branch.
