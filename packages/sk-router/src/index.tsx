import navaid from 'navaid';
import Component from '@skatejs/core';
import define from '@skatejs/define';
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
    path: String
  };
  page: any = null;
  path: string = '';
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
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
    this.router = navaid('/', path => {
      if (this.notFound) {
        this.route(this.notFound, { path });
      }
    });
  }
  childrenChanged() {
    Array.from(this.children).forEach((route: Route) => {
      if (route.path === '*') {
        this.notFound = route;
      } else {
        this.router.on(route.path, params => {
          this.route(route, params);
        });
      }
    });
    this.router.listen();
  }
  route(route, params) {
    if (this.previousRoute === route) {
      return;
    }
    if (this.previousRoute) {
      this.previousRoute.shadowRoot.innerHTML = '';
    }
    if (route.page.prototype instanceof HTMLElement) {
      route.shadowRoot.innerHTML = '';
      var Page = define(route.page);
      route.shadowRoot.appendChild(new Page());
    } else if (route.page[0] === '<') {
      route.shadowRoot.innerHTML = route.page;
    } else {
      route.shadowRoot.innerHTML = '<' + route.page + '></' + route.page + '>';
    }
    Object.assign(route.shadowRoot.firstElementChild, params);
    this.previousRoute = route;
  }
}
