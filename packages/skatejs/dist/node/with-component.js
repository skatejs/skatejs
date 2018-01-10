'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.withComponent = undefined;

var _withChildren = require('./with-children.js');

var _withContext = require('./with-context.js');

var _withLifecycle = require('./with-lifecycle.js');

var _withUpdate = require('./with-update.js');

var _withRenderer = require('./with-renderer.js');

const withComponent = (exports.withComponent = (Base = HTMLElement) =>
  (0, _withLifecycle.withLifecycle)(
    (0, _withChildren.withChildren)(
      (0, _withContext.withContext)(
        (0, _withUpdate.withUpdate)(
          (0, _withRenderer.withRenderer)(Base || HTMLElement)
        )
      )
    )
  ));
