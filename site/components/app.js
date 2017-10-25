import { Component, h } from '../utils';
import { define } from '../../src';
import { Router, Route } from '@skatejs/sk-router';

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
      `
    };
    renderCallback() {
      return (
        <div class="outer">
          <style>{`
            ${this.context.style}
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
