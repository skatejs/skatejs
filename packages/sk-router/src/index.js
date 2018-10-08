// @jsx h

import page from 'page';
import { define, props, withComponent } from 'skatejs';

const Component = withComponent();

export class Link extends Component {
  static is = 'sk-link';
  static props = {
    classNames: props.object,
    css: props.string,
    href: props.string
  };
  classNames = {
    a: ''
  };
  go = e => {
    e.preventDefault();
    page.show(this.href);
  };
  render({ classNames, css, href }) {
    return `<a class="${classNames.a}" ${
      href ? `href="${href}"` : ''
    }><style>${css}</style><slot></slot></a>`;
  }
  rendered() {
    this.shadowRoot.firstChild.addEventListener('click', this.go);
  }
}

export class Route extends Component {
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
    if (PageToRender && PageToRender.prototype) {
      const { shadowRoot } = this;
      shadowRoot.this.innerHTML = '';
      shadowRoot.this.appendChild(new PageToRender());
    }
  }
}

export class Router extends Component {
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
    return `<slot></slot>`;
  }
}

[Link, Route, Router].forEach(define);
