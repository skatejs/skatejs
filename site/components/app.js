import css, { value } from 'yocss';
import globalStyles from '../css';
import { Loading } from './primitives';
import { Component, h, withLoadablePreact } from '../utils';
import { define, props } from 'skatejs';
import { Router, Route } from '@skatejs/sk-router';
import logo50 from '../img/logo-50x50.png';
import logo100 from '../img/logo-100x100.png';
import RouteIndex from '../pages';

const withLoading = loader =>
  withLoadablePreact({
    loader: loader,
    loading: Loading
  });

const router = (
  <Router.is>
    <Route.is page={RouteIndex} path="/" />
    <Route.is
      page={withLoading(() => import('../pages/guides'))}
      path="/guides"
    />
    <Route.is
      page={withLoading(() => import('../pages/guides/flowtype'))}
      path="/guides/flowtype"
    />
    <Route.is
      page={withLoading(() => import('../pages/mixins/with-children'))}
      path="/mixins/with-children"
    />
    <Route.is
      page={withLoading(() => import('../pages/mixins/with-component'))}
      path="/mixins/with-component"
    />
    <Route.is
      page={withLoading(() => import('../pages/mixins/with-context'))}
      path="/mixins/with-context"
    />
    <Route.is
      page={withLoading(() => import('../pages/mixins/with-lifecycle'))}
      path="/mixins/with-lifecycle"
    />
    <Route.is
      page={withLoading(() => import('../pages/mixins/with-renderer'))}
      path="/mixins/with-renderer"
    />
    <Route.is
      page={withLoading(() => import('../pages/mixins/with-update'))}
      path="/mixins/with-update"
    />
    <Route.is
      page={withLoading(() => import('../pages/mixins/with-unique'))}
      path="/mixins/with-unique"
    />
    <Route.is
      page={withLoading(() => import('../pages/mixins'))}
      path="/mixins"
    />
    <Route.is
      page={withLoading(() => import('../pages/renderers/default'))}
      path="/renderers/default"
    />
    <Route.is
      page={withLoading(() => import('../pages/renderers/with-lit-html'))}
      path="/renderers/with-lit-html"
    />
    <Route.is
      page={withLoading(() => import('../pages/renderers/with-preact'))}
      path="/renderers/with-preact"
    />
    <Route.is
      page={withLoading(() => import('../pages/renderers/with-react'))}
      path="/renderers/with-react"
    />
    <Route.is
      page={withLoading(() => import('../pages/renderers'))}
      path="/renderers"
    />
    <Route.is
      page={withLoading(() => import('../pages/utils/define'))}
      path="/utils/define"
    />
    <Route.is
      page={withLoading(() => import('../pages/utils/emit'))}
      path="/utils/emit"
    />
    <Route.is
      page={withLoading(() => import('../pages/utils/link'))}
      path="/utils/link"
    />
    <Route.is
      page={withLoading(() => import('../pages/utils/shadow'))}
      path="/utils/shadow"
    />
    <Route.is
      page={withLoading(() => import('../pages/utils'))}
      path="/utils"
    />
    <Route.is page={withLoading(() => import('../pages/404'))} path="*" />
  </Router.is>
);

const cssApp = css({
  borderTop: '5px solid #F2567C',
  padding: '50px 25px 25px 25px'
});
export default define(
  class App extends Component {
    context = {
      style: value(globalStyles)
    };
    onHistory = () => {
      window.scrollTo(0, 0);
      this.state = { href: location.pathname };
    };
    connecting() {
      this.onHistory();
      window.addEventListener('popstate', this.onHistory);
      window.addEventListener('pushstate', this.onHistory);
      window.addEventListener('replaceState', this.onHistory);
    }
    render({ context, state }) {
      return (
        <div class={cssApp}>
          <style>{`
            ${context.style}
            ${value(cssApp)}
          `}</style>
          <img class="logo" src={state.href === '/' ? logo100 : logo50} />
          {router}
        </div>
      );
    }
  }
);
