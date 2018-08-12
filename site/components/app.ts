import './primitives';
import '@skatejs/sk-router';

import { html } from 'lit-html/lib/lit-extended';
import { define, name } from 'skatejs';
import css, { value } from 'yocss';

import { Component, style, withLoadable } from '../utils';
import globalStyles from '../css';
import logo50 from '../img/logo-50x50.png';
import logo100 from '../img/logo-100x100.png';
import RouteIndex from '../pages';

let withLoadingCount = 0;
const withLoading = loader =>
  withLoadable({
    is: name(),
    loader: loader,
    loading: html`<x-loading></x-loading>`
  });

const router = html`
  <sk-router>
    <sk-route page="${RouteIndex}" path="/"></sk-route>
    <sk-route
      page="${withLoading(() => import('../pages/guides'))}"
      path="/guides"
    ></sk-route>
    <sk-route
      page="${withLoading(() => import('../pages/guides/flowtype'))}"
      path="/guides/flowtype"
    ></sk-route>
    <sk-route
      page="${withLoading(() => import('../pages/guides/getting-started'))}"
      path="/guides/getting-started"
    ></sk-route>
    <sk-route
      page="${withLoading(() => import('../pages/guides/storybook'))}"
      path="/guides/storybook"
    ></sk-route>
    <sk-route
      page="${withLoading(() => import('../pages/migrating'))}"
      path="/migrating"
    ></sk-route>
    <sk-route
      page="${withLoading(() => import('../pages/components'))}"
      path="/components"
    ></sk-route>
    <sk-route
      page="${withLoading(() => import('../pages/renderers/default'))}"
      path="/renderers/default"
    ></sk-route>
    <sk-route
      page="${withLoading(() => import('../pages/renderers/with-lit-html'))}"
      path="/renderers/with-lit-html"
    ></sk-route>
    <sk-route
      page="${withLoading(() => import('../pages/renderers/with-preact'))}"
      path="/renderers/with-preact"
    ></sk-route>
    <sk-route
      page="${withLoading(() => import('../pages/renderers/with-react'))}"
      path="/renderers/with-react"
    ></sk-route>
    <sk-route
      page="${withLoading(() => import('../pages/renderers'))}"
      path="/renderers"
    ></sk-route>
    <sk-route
      page="${withLoading(() => import('../pages/utils/define'))}"
      path="/utils/define"
    ></sk-route>
    <sk-route
      page="${withLoading(() => import('../pages/utils/emit'))}"
      path="/utils/emit"
    ></sk-route>
    <sk-route
      page="${withLoading(() => import('../pages/utils/link'))}"
      path="/utils/link"
    ></sk-route>
    <sk-route
      page="${withLoading(() => import('../pages/utils/name'))}"
      path="/utils/name"
    ></sk-route>
    <sk-route
      page="${withLoading(() => import('../pages/utils/shadow'))}"
      path="/utils/shadow"
    ></sk-route>
    <sk-route
      page="${withLoading(() => import('../pages/utils'))}"
      path="/utils"
    ></sk-route>
    <sk-route
      page="${withLoading(() => import('../pages/404'))}"
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
    render({ state }) {
      return this.$`
      ${this.$style}
      <div className="${cssApp}">
        ${style(value(cssApp))}
        <img class="logo" src="${state.href === '/' ? logo100 : logo50}">
        ${router}
      </div>
    `;
    }
  }
);
