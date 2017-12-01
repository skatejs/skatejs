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

const Route404 = withLoading(() => import('../pages/404'));
const RouteMixins = withLoading(() => import('../pages/mixins'));
const RouteRenderers = withLoading(() => import('../pages/renderers'));
const RouteUtils = withLoading(() => import('../pages/utils'));
const RouteUtilsDefine = withLoading(() => import('../pages/utils/define'));
const RouteUtilsEmit = withLoading(() => import('../pages/utils/emit'));
const RouteUtilsLink = withLoading(() => import('../pages/utils/link'));
const RouteUtilsShadow = withLoading(() => import('../pages/utils/shadow'));
const RouteWithChildren = withLoading(() =>
  import('../pages/mixins/with-children')
);
const RouteWithComponent = withLoading(() =>
  import('../pages/mixins/with-component')
);
const RouteWithContext = withLoading(() =>
  import('../pages/mixins/with-context')
);
const RouteWithLifecycle = withLoading(() =>
  import('../pages/mixins/with-lifecycle')
);
const RouteWithLitHtml = withLoading(() =>
  import('../pages/renderers/with-lit-html')
);
const RouteWithRenderer = withLoading(() =>
  import('../pages/mixins/with-renderer')
);
const RouteWithPreact = withLoading(() =>
  import('../pages/renderers/with-preact')
);
const RouteWithReact = withLoading(() =>
  import('../pages/renderers/with-react')
);
const RouteWithUpdate = withLoading(() =>
  import('../pages/mixins/with-update')
);
const RouteWithUnique = withLoading(() =>
  import('../pages/mixins/with-unique')
);

const router = (
  <Router.is>
    <Route.is page={RouteIndex} path="/" />
    <Route.is page={RouteWithChildren} path="/mixins/with-children" />
    <Route.is page={RouteWithComponent} path="/mixins/with-component" />
    <Route.is page={RouteWithContext} path="/mixins/with-context" />
    <Route.is page={RouteWithLifecycle} path="/mixins/with-lifecycle" />
    <Route.is page={RouteWithRenderer} path="/mixins/with-renderer" />
    <Route.is page={RouteWithUpdate} path="/mixins/with-update" />
    <Route.is page={RouteWithUnique} path="/mixins/with-unique" />
    <Route.is page={RouteMixins} path="/mixins" />
    <Route.is page={RouteWithLitHtml} path="/renderers/with-lit-html" />
    <Route.is page={RouteWithPreact} path="/renderers/with-preact" />
    <Route.is page={RouteWithReact} path="/renderers/with-react" />
    <Route.is page={RouteRenderers} path="/renderers" />
    <Route.is page={RouteUtilsDefine} path="/utils/define" />
    <Route.is page={RouteUtilsEmit} path="/utils/emit" />
    <Route.is page={RouteUtilsLink} path="/utils/link" />
    <Route.is page={RouteUtilsShadow} path="/utils/shadow" />
    <Route.is page={RouteUtils} path="/utils" />
    <Route.is page={Route404} path="*" />
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
