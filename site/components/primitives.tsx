import { Link as SkLink } from '@skatejs/sk-router';
import css, { value } from 'yocss';
import { Component, h, style } from '../utils';

// @ts-ignore
import loaderImg from '../img/loader.svg';

const cssHr = css({
  letterSpacing: '10px',
  margin: '50px 0',
  textAlign: 'center'
});

export class Hr extends Component {
  render() {
    return (
      <div class={cssHr}>
        {style(value(cssHr))}
        {'&mdash;&mdash;&mdash'}
      </div>
    );
  }
}

const publicUrl = 'skatejs.netlify.com';

export class Link extends Component {
  classNames: { a: string } = { a: '' };
  css: string = '';
  href: string = '';
  render() {
    let { classNames, context, css, href } = this;
    if (href.indexOf(publicUrl) > -1) {
      href = href.split(publicUrl)[1];
    }
    return href.indexOf('://') > -1 ? (
      <a className={classNames.a} href={href}>
        {style(context.style, css)}
        <slot />
      </a>
    ) : (
      <SkLink classNames={classNames} css={context.style + css} href={href}>
        <slot />
      </SkLink>
    );
  }
}

const cssLoading = css({
  display: 'block',
  margin: '60px auto 0 auto',
  width: '44px'
});

export class Loading extends Component {
  render() {
    return (
      <div class={cssLoading}>
        {style(value(cssLoading))}
        <img src={loaderImg} />
      </div>
    );
  }
}

const cssNote = css({
  backgroundColor: '#DCE4CA',
  borderLeft: '3px solid #c6d3a8',
  display: 'block',
  margin: '20px 0',
  padding: '10px 15px'
});

export class Note extends Component {
  static is = 'x-note';
  render() {
    return (
      <em className={cssNote}>
        {style(value(cssNote))}
        <slot />
      </em>
    );
  }
}
