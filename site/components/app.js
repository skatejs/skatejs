import './primitives';
import '@skatejs/sk-router';

import { html } from 'lit-html/lib/lit-extended';
import { define, props } from 'skatejs';
import css, { value } from 'yocss';

import { Component, style, withLoadable } from '../utils';
import globalStyles from '../css';
import logo50 from '../img/logo-50x50.png';
import logo100 from '../img/logo-100x100.png';
import RouteIndex from '../pages';

// TODO wrap all routes with this again.
const withLoading = loader =>
  withLoadable({
    loader: loader,
    loading: html`<x-loading></x-loading>`
  });

const router = html`
  <sk-router>
    <sk-route page="${RouteIndex}" path="/"></sk-route>
    <sk-route
      page="${import('../pages/guides')}"
      path="/guides"
    ></sk-route>
    <sk-route
      page="${import('../pages/guides/flowtype')}"
      path="/guides/flowtype"
    ></sk-route>
    <sk-route
      page="${import('../pages/mixins')}"
      path="/mixins"
    ></sk-route>
    <sk-route
      page="${import('../pages/mixins/with-children')}"
      path="/mixins/with-children"
    ></sk-route>
    <sk-route
      page="${import('../pages/mixins/with-component')}"
      path="/mixins/with-component"
    ></sk-route>
    <sk-route
      page="${import('../pages/mixins/with-context')}"
      path="/mixins/with-context"
    ></sk-route>
    <sk-route
      page="${import('../pages/mixins/with-lifecycle')}"
      path="/mixins/with-lifecycle"
    ></sk-route>
    <sk-route
      page="${import('../pages/mixins/with-renderer')}"
      path="/mixins/with-renderer"
    ></sk-route>
    <sk-route
      page="${import('../pages/mixins/with-update')}"
      path="/mixins/with-update"
    ></sk-route>
    <sk-route
      page="${import('../pages/renderers/default')}"
      path="/renderers/default"
    ></sk-route>
    <sk-route
      page="${import('../pages/renderers/with-lit-html')}"
      path="/renderers/with-lit-html"
    ></sk-route>
    <sk-route
      page="${import('../pages/renderers/with-preact')}"
      path="/renderers/with-preact"
    ></sk-route>
    <sk-route
      page="${import('../pages/renderers/with-react')}"
      path="/renderers/with-react"
    ></sk-route>
    <sk-route
      page="${import('../pages/renderers')}"
      path="/renderers"
    ></sk-route>
    <sk-route
      page="${import('../pages/utils/define')}"
      path="/utils/define"
    ></sk-route>
    <sk-route
      page="${import('../pages/utils/emit')}"
      path="/utils/emit"
    ></sk-route>
    <sk-route
      page="${import('../pages/utils/link')}"
      path="/utils/link"
    ></sk-route>
    <sk-route
      page="${import('../pages/utils/shadow')}"
      path="/utils/shadow"
    ></sk-route>
    <sk-route
      page="${import('../pages/utils')}"
      path="/utils"
    ></sk-route>
    <sk-route
      page="${import('../pages/404')}"
      path="*"
    ></sk-route>
  </sk-router>
`;

const cssApp = css({
  borderTop: '5px solid #F2567C',
  padding: '50px 25px 25px 25px'
});
export default define(
  class extends Component {
    static is = 'x-app';
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
    render() {
      return this.$`
        ${this.$style}
        <div className="${cssApp}">
          ${style(value(cssApp))}
          <img class="logo">
          ${router}
        </div>
      `;
    }
  }
);
