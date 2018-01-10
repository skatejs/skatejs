// @jsx h

import page from 'page';
import { define, props, withComponent } from 'skatejs';
import { h } from '@skatejs/val';

class Component extends withComponent() {
  renderer(renderRoot, render) {
    const { firstChild } = renderRoot;
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
}

export class Link extends Component {
  constructor(...args) {
    var _temp;

    return (
      (_temp = super(...args)),
      (this.go = e => {
        e.preventDefault();
        page.show(this.href);
      }),
      _temp
    );
  }

  render({ classNames, css, href }) {
    return h(
      'a',
      { className: classNames.a || '', href: href, events: { click: this.go } },
      h('style', null, css),
      h('slot', null)
    );
  }
}

Link.is = 'sk-link';
Link.props = {
  classNames: props.object,
  css: props.string,
  href: props.string
};
export class Route extends Component {
  updated(...args) {
    let { PageToRender } = this;
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
      return h(PageToRender, null);
    }
  }
}

Route.is = 'sk-route';
Route.props = {
  page: null,
  PageToRender: null,
  path: props.string,
  propsToRender: props.object
};
export class Router extends Component {
  childrenUpdated() {
    [...this.children].forEach(route => {
      page(route.path, (ctxt, next) => {
        route.propsToRender = ctxt;
        route.PageToRender = route.page;
      });
      page.exit(route.path, (ctxt, next) => {
        route.PageToRender = null;
        next();
      });
    });
    page.start();
  }
  updated(...args) {
    page(this.options);
    return super.updated(...args);
  }
  render() {
    return h('slot', null);
  }
}

Router.is = 'sk-router';
Router.props = {
  options: props.object
};
[Link, Route, Router].forEach(define);
