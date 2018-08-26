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
  page: any = null;
  path: string = '';
  state = {
    pageProps: null,
    pageValue: null
  };
  load = params => {
    this.state = {
      pageProps: params,
      pageValue: this.page
    };
  };
  unload = () => {
    this.state = {
      pageProps: null,
      pageValue: null
    };
  };
  renderer = () => {
    const { pageProps, pageValue } = this.state;
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
  private notFound: any;
  private previousRoute: any;
  private router: any;
  constructor() {
    super();
    this.addEventListener('sk-route-link', (e: CustomEvent) => {
      this.router.route(e.detail);
    });
  }
  load = (route, params) => {
    this.unload();
    this.previousRoute = route;
    route.load(params);
  };
  unload = () => {
    if (this.previousRoute) {
      this.previousRoute.unload();
    }
  };
  propChanged(name, oldValue, newValue) {
    // This may be the initial setting.
    if (this.router) {
      this.router.unlisten();
    }
    this.router = navaid(newValue, path => {
      if (this.notFound) {
        this.unload();
        this.notFound.load({ path });
      }
    });
    this.router.listen();
  }
  connectedCallback() {
    super.connectedCallback();
  }
  childrenChanged() {
    this.router.unlisten();
    Array.from(this.children).forEach((route: Route) => {
      if (route.path === '*') {
        this.notFound = route;
      } else {
        this.router.on(route.path, params => {
          this.load(route, params);
        });
      }
    });
    this.router.listen();
  }
  render() {
    return <slot />;
  }
}
