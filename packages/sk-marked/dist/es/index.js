var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var _class, _temp;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

import { define, props, withComponent } from 'skatejs';
import marked from 'marked';

function format(src) {
  src = src.replace(/"/g, '&quot;');

  // Remove leading newlines.
  src = src.split('\n');

  // Get the initial indent so we can remove it from subsequent lines.
  var indent = src[1] ? src[1].match(/^\s*/)[0].length : 0;

  // Format indentation.
  src = src.map(function(s) {
    return s.substring(indent);
  });

  // Re-instate newline formatting.
  return src.join('\n');
}

export default define(
  ((_temp = _class = (function(_withComponent) {
    _inherits(_class, _withComponent);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(
        this,
        (_class.__proto__ || Object.getPrototypeOf(_class)).apply(
          this,
          arguments
        )
      );
    }

    _createClass(_class, [
      {
        key: 'render',
        value: function render(_ref) {
          var css = _ref.css,
            renderers = _ref.renderers,
            src = _ref.src;

          var renderer = new marked.Renderer();
          Object.assign(renderer, renderers);
          return (
            '\n      <style>' +
            css +
            '></style>\n      ' +
            marked(format(src), { renderer: renderer }) +
            '\n    '
          );
        }
      }
    ]);

    return _class;
  })(withComponent())),
  (_class.is = 'sk-marked'),
  (_class.props = {
    css: props.string,
    renderers: props.object,
    src: props.string
  }),
  _temp)
);
