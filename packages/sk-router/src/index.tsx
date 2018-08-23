import page from 'page';
import { Component } from 'skatejs';
import { h } from '@skatejs/val';

class Base extends Component {
  renderer = function(renderRoot, render) {
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
  };
}

export class Link extends Base {
  static props = {
    classNames: Object,
    css: String,
    href: String
  };
  classNames: { [s: string]: string } = { a: '' };
  css: string = '';
  href: string = '';
  go = e => {
    e.preventDefault();
    page.show(this.href);
  };
  render() {
    const { classNames, css, href } = this;
    return (
      <a class={classNames.a} href={href} events={{ click: this.go }}>
        <style>{css}</style>
        <slot />
      </a>
    );
  }
}

export class Route extends Base {
  static props = {
    page: null,
    PageToRender: null,
    path: String,
    propsToRender: Object
  };
  page?: typeof HTMLElement = null;
  PageToRender?: typeof HTMLElement = null;
  path: string = '';
  propsToRender: { [s: string]: any } = {};
  updated(prev, next) {
    let { PageToRender } = this;
    let PageToRenderInstance;
    if (PageToRender) {
      if (PageToRender.constructor === Function) {
        PageToRenderInstance = new PageToRender();
      }
      if (PageToRenderInstance.then) {
        PageToRenderInstance.then(
          Page => (this.PageToRender = Page.default || Page)
        );
      }
    }
    super.updated(prev, next);
  }
  render() {
    const { PageToRender, propsToRender } = this;
    if (PageToRender && PageToRender.prototype) {
      return <PageToRender {...propsToRender} />;
    }
  }
}

export class Router extends Base {
  static props = {
    options: Object
  };
  options: { [s: string]: any } = {};
  childrenUpdated() {
    for (const route of this.children) {
      page(route.path, ctxt => {
        route.propsToRender = ctxt;
        route.PageToRender = route.page;
      });
      page.exit(route.path, (ctxt, next) => {
        route.PageToRender = null;
        next();
      });
    }
    page.start();
  }
  updated(prev, next) {
    page(this.options);
    return super.updated(prev, next);
  }
  render() {
    return <slot />;
  }
}
