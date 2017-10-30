import { Component, h } from '../utils';
import { define, emit, props } from '../../src';
import { Router, Route } from '@skatejs/sk-router';
import logoSrc from '../img/logo.png';

const oldPushState = window.history.pushState;
const oldReplaceState = window.history.replaceState;
window.history.pushState = function(...args) {
  oldPushState.call(this, ...args);
  emit(window, 'pushstate');
};
window.history.replaceState = function(...args) {
  oldReplaceState.call(this, ...args);
  emit(window, 'replacestate');
};

const router = (
  <Router.is>
    <Route.is page={() => import('../pages')} path="/" />
    <Route.is
      page={() => import('../pages/mixins/with-children')}
      path="/mixins/with-children"
    />
    <Route.is
      page={() => import('../pages/mixins/with-component')}
      path="/mixins/with-component"
    />
    <Route.is
      page={() => import('../pages/mixins/with-context')}
      path="/mixins/with-context"
    />
    <Route.is
      page={() => import('../pages/mixins/with-lifecycle')}
      path="/mixins/with-lifecycle"
    />
    <Route.is
      page={() => import('../pages/mixins/with-renderer')}
      path="/mixins/with-renderer"
    />
    <Route.is
      page={() => import('../pages/mixins/with-update')}
      path="/mixins/with-update"
    />
    <Route.is
      page={() => import('../pages/mixins/with-unique')}
      path="/mixins/with-unique"
    />
    <Route.is page={() => import('../pages/mixins')} path="/mixins" />
    <Route.is page={() => import('../pages/renderers')} path="/renderers" />
    <Route.is page={() => import('../pages/utilities')} path="/utilities" />
    <Route.is page={() => import('../pages/404')} path="*" />
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
          font-weight: lighter;
          font-size: 1.8em;
          margin: 60px 0 30px 0;
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
    willMount() {
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
