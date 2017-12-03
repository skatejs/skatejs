import '@skatejs/sk-router';

import css, { value } from 'yocss';

import { component, style } from '../utils';
import loaderImg from 'file-loader!../img/loader.svg';

const cssHr = css({
  letterSpacing: '10px',
  margin: '50px 0',
  textAlign: 'center'
});
export const Hr = component(function hr() {
  return this.$`
    <div className="${cssHr}">
      ${style(value(cssHr))}
      &mdash;&mdash;&mdash;
    </div>
  `;
});

export const Link = component(
  function link(classNames, css, href) {
    return this.$`
      <sk-link
        classNames="${classNames}"
        css="${this.context.style + css}"
        href="${href}"
      >
        <slot></slot>
      </sk-link>
    `;
  },
  ['classNames', 'css', 'href']
);

const cssLoading = css({
  display: 'block',
  margin: '60px auto 0 auto',
  width: '44px'
});
export const Loading = component(function loader() {
  return this.$`
    <div className="${cssLoading}">
      ${style(value(cssLoading))}
      <img src="${loaderImg}">
    </div>
  `;
});

const cssNote = css({
  backgroundColor: '#DCE4CA',
  borderLeft: '3px solid #c6d3a8',
  display: 'block',
  margin: '20px 0',
  padding: '10px 15px'
});
export const Note = component(function note() {
  return this.$`
    <em className="${cssNote}">
      ${style(value(cssNote))}
      <slot></slot>
    </em>
  `;
});
