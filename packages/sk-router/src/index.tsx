import navaid from 'navaid';
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
    this.dispatchEvent(
      new CustomEvent('sk-route-link', {
        bubbles: true,
        composed: true,
        detail: this.href
      })
    );
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
    page: Object,
    pageProps: Object,
    pageValue: Object,
    path: String
  };
  page: any = undefined;
  pageProps: any = null;
  pageValue: any = null;
  path: string = '';
  renderer = () => {
    const { pageProps, pageValue } = this;
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
      this.shadowRoot.firstElementChild['props'] = pageProps;
    } else {
      this.shadowRoot.innerHTML = '';
    }
  };
}

export class Router extends Base {
  static props = {
    base: String
  };
  base = '/';
  notFound: any;
  previousRoute: any;
  router: any;
  constructor() {
    super();
    this.addEventListener('sk-route-link', (e: CustomEvent) => {
      this.router.route(e.detail);
    });
  }
  propChanged(name, oldValue, newValue) {
    if (this.router) {
      this.router.unlisten();
    }
    this.router = navaid(newValue, path => {
      if (this.notFound) {
        this.notFound.pageProps = { path };
        this.notFound.pageValue = this.notFound.page;
      }
    });
    this.router.listen();
  }
  connectedCallback() {
    super.connectedCallback();
  }
  childrenUpdated() {
    this.router.unlisten();
    Array.from(this.children).forEach(route => {
      if (route.path === '*') {
        this.notFound = route;
      } else {
        this.router.on(route.path, params => {
          if (this.previousRoute === route) {
            return;
          }
          if (this.previousRoute) {
            this.previousRoute.pageValue = null;
          }
          this.previousRoute = route;
          route.pageProps = params;
          route.pageValue = route.page;
        });
      }
    });
    this.router.listen();
  }
  render() {
    return <slot />;
  }
}
