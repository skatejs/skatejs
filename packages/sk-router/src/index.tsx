import page from 'page';
import { Component, define } from 'skatejs';
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
      <a className={classNames.a} href={href} events={{ click: this.go }}>
        <style>{css}</style>
        <slot />
      </a>
    );
  }
}

export class Route extends Component {
  static props = {
    page: null,
    PageToRender: null,
    path: String,
    propsToRender: Object
  };
  page: any = null;
  pageValue: any = null;
  path: string = '';
  propChanged(name, oldValue, newValue) {
    if (name !== 'page') {
      return;
    }
    if (newValue) {
      if (page.prototype === Function.prototype) {
        newValue = newValue();
      }

      if (newValue.then) {
        newValue.then(p => (this.pageValue = p.default || p));
      } else {
        this.pageValue = newValue;
      }
    }
  }
  shouldUpdate() {
    return this.pageValue;
  }
  renderer = () => {
    const { pageValue } = this;
    if (pageValue) {
      if (pageValue.prototype instanceof HTMLElement) {
        this.shadowRoot.innerHTML = '';
        const Page = define(pageValue);
        this.shadowRoot.appendChild(new Page());
      } else if (pageValue[0] === '<') {
        this.shadowRoot.innerHTML = pageValue;
      } else {
        this.shadowRoot.innerHTML = `<${pageValue}></${pageValue}>`;
      }
    }
  };
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
