import page from 'page';
import { component, CustomElementConstructor, define, props } from 'skatejs';
import { h } from '@skatejs/val';

function base(
  Base: typeof HTMLElement = HTMLElement
): CustomElementConstructor {
  return class extends component(HTMLElement) {
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
  };
}

export class Link extends base() {
  static is = 'sk-link';
  classNames: { a: string } = { a: '' };
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

export class Route extends base() {
  static is = 'sk-route';
  page?: typeof HTMLElement;
  PageToRender?: typeof HTMLElement;
  path: string;
  propsToRender?: {};
  updated(...args) {
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
    super.updated(...args);
  }
  render() {
    const { PageToRender, propsToRender } = this;
    if (PageToRender && PageToRender.prototype) {
      return <PageToRender {...propsToRender} />;
    }
  }
}

type RouterProps = {};

export class Router extends base() {
  static is = 'sk-router';
  options: {} = {};
  childrenUpdated() {
    [...this.children].forEach((route: Route) => {
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
