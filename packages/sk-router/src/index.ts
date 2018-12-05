import navaid from 'navaid';
import Component from '@skatejs/component';
import define from '@skatejs/define';

export class Link extends Component {
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
    return `<a class="${classNames.a}" ${
      href ? `href="${href}"` : ''
    }><style>${css}</style><slot></slot></a>`;
  }
  rendered() {
    this.renderRoot.firstChild.addEventListener('click', this.go);
  }
}

export class Route extends Component {
  static props = {
    page: Object,
    path: String
  };
  page: any = null;
  path: string = '';
}

export class Router extends Component {
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
      const Page = define(route.page);
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
