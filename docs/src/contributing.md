---
template: layout.html
---

## Contributing

The `.editorconfig`, `.jscs` and `.jshint` configs are all set up. If you can, enable these in your editor of choice.



### Setup

To get a dev environment up and running, all you should need to do is run:

```bash
npm install
```


### Testing

To run tests:

```bash
npm test
```

If you want to keep the Karma server alive to run them in your browser of choice:

```bash
npm test -- --watch
```

To run tests in a specific browser:

```bash
npm test -- --browsers Chrome,Firefox
```



### Linting

To lint your files with `jscs` and `jshint`:

```bash
npm run lint
```



### Distribution

To build the distribution all you have to do is run:

```bash
npm run dist
```

This will build `dist/skate.js` and `dist/skate.min.js`. Don't worry about doing this in a PR; it'll avoid conflicts.

To build the `lib` (ES5 + UMD) files:

```bash
npm run lib
```



### Releasing

To release all you've got to do is run `npm release`. You can either specify the release `type`, or `tag`.

```bash
npm run release -- --tag x.x.x
```

Or:

```bash
npm run release -- --type minor
```



### Deploying

To deploy the documentation, run the following command from the branch or tag which you want to deploy:

```bash
npm run deploy
```
