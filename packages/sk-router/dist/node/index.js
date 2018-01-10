'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.Router = exports.Route = exports.Link = undefined;

var _page = require('page');

var _page2 = _interopRequireDefault(_page);

var _skatejs = require('skatejs');

var _val = require('@skatejs/val');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

class Component extends (0, _skatejs.withComponent)() {
  renderer(renderRoot, render) {
    const firstChild = renderRoot.firstChild;

    const dom = render();
    if (firstChild) {
      if (dom) {
        renderRoot.replaceChild(dom, firstChild);
      } else {
        renderRoot.removeChild(firstChild);
      }
    } else if (dom) {
      renderRoot.appendChild(dom);
    }
  }
} // @jsx h

class Link extends Component {
  constructor(...args) {
    var _temp;

    return (
      (_temp = super(...args)),
      (this.go = e => {
        e.preventDefault();
        _page2.default.show(this.href);
      }),
      _temp
    );
  }

  render({ classNames, css, href }) {
    return (0, _val.h)(
      'a',
      { className: classNames.a || '', href: href, events: { click: this.go } },
      (0, _val.h)('style', null, css),
      (0, _val.h)('slot', null)
    );
  }
}

exports.Link = Link;
Link.is = 'sk-link';
Link.props = {
  classNames: _skatejs.props.object,
  css: _skatejs.props.string,
  href: _skatejs.props.string
};
class Route extends Component {
  updated(...args) {
    let PageToRender = this.PageToRender;

    if (PageToRender) {
      if (PageToRender.constructor === Function) {
        PageToRender = new PageToRender();
      }
      if (PageToRender.then) {
        PageToRender.then(Page => (this.PageToRender = Page.default || Page));
      }
    }
    return super.updated(...args);
  }
  render({ PageToRender, propsToRender }) {
    if (
      PageToRender &&
      PageToRender.prototype &&
      PageToRender.prototype.render
    ) {
      return (0, _val.h)(PageToRender, null);
    }
  }
}

exports.Route = Route;
Route.is = 'sk-route';
Route.props = {
  page: null,
  PageToRender: null,
  path: _skatejs.props.string,
  propsToRender: _skatejs.props.object
};
class Router extends Component {
  childrenUpdated() {
    [...this.children].forEach(route => {
      (0, _page2.default)(route.path, (ctxt, next) => {
        route.propsToRender = ctxt;
        route.PageToRender = route.page;
      });
      _page2.default.exit(route.path, (ctxt, next) => {
        route.PageToRender = null;
        next();
      });
    });
    _page2.default.start();
  }
  updated(...args) {
    (0, _page2.default)(this.options);
    return super.updated(...args);
  }
  render() {
    return (0, _val.h)('slot', null);
  }
}

exports.Router = Router;
Router.is = 'sk-router';
Router.props = {
  options: _skatejs.props.object
};
[Link, Route, Router].forEach(_skatejs.define);
