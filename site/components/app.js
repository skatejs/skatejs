import { Component, h, withLoadable } from '../utils';
import { define, props } from '../../src';
import { Router, Route } from '@skatejs/sk-router';
import logoSrc from '../img/logo.png';

const Route404 = withLoadable({
  loader: () => import('../pages/404')
});
const RouteIndex = withLoadable({
  loader: () => import('../pages')
});
const RouteMixins = withLoadable({
  loader: () => import('../pages/mixins')
});
const RouteRenderers = withLoadable({
  loader: () => import('../pages/renderers')
});
const RouteUtilities = withLoadable({
  loader: () => import('../pages/utilities')
});
const RouteWithChildren = withLoadable({
  loader: () => import('../pages/mixins/with-children')
});
const RouteWithComponent = withLoadable({
  loader: () => import('../pages/mixins/with-component')
});
const RouteWithContext = withLoadable({
  loader: () => import('../pages/mixins/with-context')
});
const RouteWithLifecycle = withLoadable({
  loader: () => import('../pages/mixins/with-lifecycle')
});
const RouteWithLitHtml = withLoadable({
  loader: () => import('../pages/renderers/with-lit-html')
});
const RouteWithRenderer = withLoadable({
  loader: () => import('../pages/mixins/with-renderer')
});
const RouteWithPreact = withLoadable({
  loader: () => import('../pages/renderers/with-preact')
});
const RouteWithReact = withLoadable({
  loader: () => import('../pages/renderers/with-react')
});
const RouteWithUpdate = withLoadable({
  loader: () => import('../pages/mixins/with-update')
});
const RouteWithUnique = withLoadable({
  loader: () => import('../pages/mixins/with-unique')
});

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
    <Route.is page={RouteWithReact} path="/renderers/with-lit-html" />
    <Route.is page={RouteWithPreact} path="/renderers/with-preact" />
    <Route.is page={RouteWithReact} path="/renderers/with-react" />
    <Route.is page={RouteRenderers} path="/renderers" />
    <Route.is page={RouteUtilities} path="/utilities" />
    <Route.is page={Route404} path="*" />
  </Router.is>
);

export default define(
  class App extends Component {
    context = {
      style: `
        a {
          color: #F2567C;
          text-decoration: none;
        }
        code {
          background-color: #dce4c9;
          display: inline-block;
          font-family: monaco;
          font-size: .8em;
          padding: 0 8px;
        }
        h1 {
          font-size: 2.5em;
          font-weight: normal;
        }
        h2 {
          font-size: 1.8em;
          font-weight: lighter;
          margin: 60px 0 30px 0;
        }
        h3 {
          font-size: 1.4em;
          font-weight: lighter;
          margin: 50px 0 25px 0;
        }
        h4 {
          font-size: 1.3em;
          font-weight: lighter;
          margin: 40px 0 20px 0;
        }
        .logo {
          display: block;
          margin: 0 auto;
        }
      `
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
        <div class="outer">
          <style>{`
            ${context.style}
            .outer {
              border-top: 5px solid #F2567C;
              padding: 25px;
            }
          `}</style>
          <div class="inner">
            <img
              class="logo"
              height={state.href === '/' ? 100 : 50}
              src={logoSrc}
            />
            {router}
          </div>
        </div>
      );
    }
  }
);
