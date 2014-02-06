require({
  paths: {
    highlight: '../../bower_components/highlightjs/highlight.pack',
    skate: '../../src/skate'
  },
  shim: {
    highlight: {
      exports: 'hljs'
    }
  }
});
