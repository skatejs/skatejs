# Contributing

The `.editorconfig`, `.jscs` and `.jshint` configs are all set up. If you can, enable these in your editor of choice.

## Setup

To get a dev environment up and running, all you should need to do is run:

```bash
npm install
```
## Testing

To run tests:

```bash
npm test
```

If you want to keep the Karma server alive to run them in your browser of choice:

```bash
npm run test-watch
```

To run tests in a specific browser:

```bash
npm test -- --browsers Chrome,Firefox
npm run test-watch -- --browsers Chrome,Firefox
```

### Testing Notes

- Don't use PhantomJS. It won't work.

## Distribution

To build the `dist/` and `lib/` artifacts run:

```bash
npm run build

## Notes

- Default branch should always be the latest stable branch.
