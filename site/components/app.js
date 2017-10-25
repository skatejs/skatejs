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

export default define(
  class App extends Component {
    context = {
      style: `
        a {
          color: #F2567C;
          text-decoration: none;
        }
        code {
          font-family: monaco;
          font-size: .8em;
        }
        h1 {
          font-size: 2.5em;
          font-weight: normal;
        }
        h2 {
          font-weight: lighter;
        }
        .logo {
          display: block;
          margin: 0 auto;
        }
      `
    };
    onHistory = () => {
      this.state = { href: window.location.pathname };
    };
    connectedCallback() {
      super.connectedCallback();
      this.onHistory();
      window.addEventListener('popstate', this.onHistory);
      window.addEventListener('pushstate', this.onHistory);
      window.addEventListener('replaceState', this.onHistory);
    }
    renderCallback({ context, state }) {
      return (
        <div class="outer">
          <style>{`
            ${context.style}
            .outer {
              border-top: 5px solid #F2567C;
              padding: 25px;
            }
            .inner {
              max-width: 800px;
              margin: 0 auto;
            }
          `}</style>
          <div class="inner">
            <img
              class="logo"
              height={state.href === '/' ? 100 : 50}
              src={logoSrc}
            />
            <Router.is>
              <Route.is page={() => import('../pages')} path="/" />
              <Route.is page={() => import('../pages/mixins')} path="/mixins" />
              <Route.is
                page={() => import('../pages/renderers')}
                path="/renderers"
              />
              <Route.is
                page={() => import('../pages/utilities')}
                path="/utilities"
              />
              <Route.is page={() => import('../pages/404')} path="*" />
            </Router.is>
          </div>
        </div>
      );
    }
  }
);
