import { Route, Router } from '@skatejs/sk-router';
import RouteIndex from '../pages';
import { Loading } from './primitives';
import { Component, h, withLoadable } from '../utils';

// @ts-ignore
import logo50 from '../img/logo-50x50.png';

// @ts-ignore
import logo100 from '../img/logo-100x100.png';

const withLoading = (loader: Function) =>
  withLoadable({
    loader: loader,
    loading: () => <Loading />
  });

export default class App extends Component {
  static props = {
    state: Object
  };
  css = `
    :host {
      border-top: 5px solid #F2567C;
      display: block;
      padding: 50px 25px 25px 25px;
    }
  `;
  state: { href: string } = { href: '' };
  onHistory = () => {
    window.scrollTo(0, 0);
    this.state = { href: location.pathname };
  };
  connectedCallback() {
    super.connectedCallback();
    this.onHistory();
    window.addEventListener('popstate', this.onHistory);
    window.addEventListener('pushstate', this.onHistory);
    window.addEventListener('replaceState', this.onHistory);
  }
  render() {
    return (
      <div>
        {this.renderStyle()}
        <img class="logo" src={this.state.href === '/' ? logo100 : logo50} />
        <Router>
          <Route page={RouteIndex} path="/" />
          <Route page={withLoading(() => import('../pages/404'))} path="*" />

          <Route
            page={withLoading(() => import('../pages/docs'))}
            path="/docs"
          />
          <Route
            page={withLoading(() => import('../pages/docs/define'))}
            path="/docs/define"
          />
          <Route
            page={withLoading(() => import('../pages/docs/element'))}
            path="/docs/element"
          />
          <Route
            page={withLoading(() => import('../pages/docs/element-lit-html'))}
            path="/docs/element-lit-html"
          />
          <Route
            page={withLoading(() => import('../pages/docs/element-preact'))}
            path="/docs/element-preact"
          />
          <Route
            page={withLoading(() => import('../pages/docs/element-react'))}
            path="/docs/element-react"
          />
          <Route
            page={withLoading(() => import('../pages/docs/sk-context'))}
            path="/docs/sk-context"
          />
          <Route
            page={withLoading(() => import('../pages/docs/sk-marked'))}
            path="/docs/sk-marked"
          />
          <Route
            page={withLoading(() => import('../pages/docs/sk-router'))}
            path="/docs/sk-router"
          />

          <Route
            page={withLoading(() => import('../pages/guides/getting-started'))}
            path="/guides"
          />
          <Route
            page={withLoading(() => import('../pages/guides/getting-started'))}
            path="/guides/getting-started"
          />
          <Route
            page={withLoading(() => import('../pages/guides/storybook'))}
            path="/guides/storybook"
          />

          <Route
            page={withLoading(() => import('../pages/migrating/old-to-new'))}
            path="/migrating"
          />
          <Route
            page={withLoading(() => import('../pages/migrating/old-to-new'))}
            path="/migrating/old-to-new"
          />
        </Router>
      </div>
    );
  }
}
