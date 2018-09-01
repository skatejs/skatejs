import { Route, Router } from '@skatejs/sk-router';
import css from 'yocss';
import globalStyles from '../css';
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
  context = { style: globalStyles };
  css = {
    app: css({
      borderTop: '5px solid #F2567C',
      padding: '50px 25px 25px 25px'
    })
  };
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
      <div class={this.css.app}>
        {this.$style}
        <img class="logo" src={this.state.href === '/' ? logo100 : logo50} />
        <Router>
          <Route page={RouteIndex} path="/" />
          <Route page={withLoading(() => import('../pages/404'))} path="*" />
          <Route
            page={withLoading(() => import('../pages/components'))}
            path="/components"
          />
          <Route
            page={withLoading(() => import('../pages/components/sk-context'))}
            path="/components/sk-context"
          />
          <Route
            page={withLoading(() => import('../pages/components/sk-marked'))}
            path="/components/sk-marked"
          />
          <Route
            page={withLoading(() => import('../pages/components/sk-router'))}
            path="/components/sk-router"
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
            page={withLoading(() => import('../pages/guides/flowtype'))}
            path="/guides/flowtype"
          />
          <Route
            page={withLoading(() => import('../pages/guides/storybook'))}
            path="/guides/storybook"
          />
          <Route
            page={withLoading(() => import('../pages/migrating/4.x-5.x'))}
            path="/migrating"
          />
          <Route
            page={withLoading(() => import('../pages/migrating/4.x-5.x'))}
            path="/migrating/4.x-5.x"
          />
          <Route
            page={withLoading(() => import('../pages/migrating/5.x-6.x'))}
            path="/migrating/5.x-6.x"
          />
          {/* <Route
              page={withLoading(() => import('../pages/components'))}
              path="/components"
            />
            <Route
              page={withLoading(() => import('../pages/renderers/default'))}
              path="/renderers/default"
            />
            <Route
              page={withLoading(() =>
                import('../pages/renderers/with-lit-html')
              )}
              path="/renderers/with-lit-html"
            />
            <Route
              page={withLoading(() => import('../pages/renderers/with-preact'))}
              path="/renderers/with-preact"
            />
            <Route
              page={withLoading(() => import('../pages/renderers/with-react'))}
              path="/renderers/with-react"
            />
            <Route
              page={withLoading(() => import('../pages/renderers'))}
              path="/renderers"
            />
            <Route
              page={withLoading(() => import('../pages/utils/define'))}
              path="/utils/define"
            />
            <Route
              page={withLoading(() => import('../pages/utils/emit'))}
              path="/utils/emit"
            />
            <Route
              page={withLoading(() => import('../pages/utils/link'))}
              path="/utils/link"
            />
            <Route
              page={withLoading(() => import('../pages/utils/name'))}
              path="/utils/name"
            />
            <Route
              page={withLoading(() => import('../pages/utils/shadow'))}
              path="/utils/shadow"
            />
            <Route
              page={withLoading(() => import('../pages/utils'))}
              path="/utils"
            />*/}
        </Router>
      </div>
    );
  }
}
