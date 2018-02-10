// @jsx h

import page from 'page';
import { define, props, withComponent } from 'skatejs';
import { h } from '@skatejs/val';

class Base extends withComponent() {
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

export class Link extends Base {
  static is = 'sk-link';
  static props = {
    classNames: props.object,
    css: props.string,
    href: props.string
  };
  go = e => {
    e.preventDefault();
    page.show(this.href);
  };
  render({ classNames, css, href }) {
    return (
      <a className={classNames.a || ''} href={href} events={{ click: this.go }}>
        <style>{css}</style>
        <slot />
      </a>
    );
  }
}

export class Route extends Base {
  static is = 'sk-route';
  static props = {
    page: null,
    PageToRender: null,
    path: props.string,
    propsToRender: props.object
  };
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
      return <PageToRender />;
    }
  }
}

export class Router extends Base {
  static is = 'sk-router';
  static props = {
    options: props.object
  };
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
    return <slot />;
  }
}

[Link, Route, Router].forEach(define);
