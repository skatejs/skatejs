import css, { value } from 'yocss';
import { Link as SkLink } from '@skatejs/sk-router';
import { component, h } from '../utils';
import loaderImg from 'file-loader!../img/loader.svg';

const cssHr = css({
  letterSpacing: '10px',
  margin: '50px 0',
  textAlign: 'center'
});
export const Hr = component(function hr() {
  return (
    <div class={cssHr}>
      <style>{value(cssHr)}</style>
      &mdash;&mdash;&mdash;
    </div>
  );
});

export const Link = component(
  function link(classNames, css, href) {
    return (
      <SkLink.is
        classNames={classNames}
        css={this.context.style + css}
        href={href}
      >
        <slot />
      </SkLink.is>
    );
  },
  ['classNames', 'css', 'href']
);

const cssLoading = css({
  display: 'block',
  margin: '60px auto 0 auto',
  width: '44px'
});
export const Loading = component(function loader() {
  return (
    <div class={cssLoading}>
      <style>{value(cssLoading)}</style>
      <img src={loaderImg} />
    </div>
  );
});

const cssNote = css({
  backgroundColor: '#DCE4CA',
  borderLeft: '3px solid #c6d3a8',
  display: 'block',
  margin: '20px 0',
  padding: '10px 15px'
});
export const Note = component(function note() {
  return (
    <em class={cssNote}>
      <style>{value(cssNote)}</style>
      <slot />
    </em>
  );
});
