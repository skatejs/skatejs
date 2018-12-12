import { Link as SkLink } from '@skatejs/sk-router';
import { Component, h } from '../utils';

// @ts-ignore
import loaderImg from '../img/loader.svg';

export class Hr extends Component {
  css = `
    .hr {
      letter-spacing: 10px;
      margin: 50px 0;
      text-align: center;
    }
  `;
  render() {
    return (
      <div class="hr">
        {this.renderStyle()}
        &mdash;&mdash;&mdash;
      </div>
    );
  }
}

const publicUrl = 'skatejs.netlify.com';

export class Link extends Component {
  static props = {
    css: String,
    href: String
  };
  css: string = '';
  href: string = '';
  render() {
    let { css, href } = this;
    if (href.indexOf(publicUrl) > -1) {
      href = href.split(publicUrl)[1];
    }
    return href.indexOf('://') > -1 ? (
      <a href={href}>
        {this.renderStyle(css)}
        <slot />
      </a>
    ) : (
      <SkLink css={this.getStyle(css)} href={href}>
        <slot />
      </SkLink>
    );
  }
}

export class Loading extends Component {
  css = `
    .loading {
      display: block;
      margin: 60px auto 0 auto;
      width: 44px;
    }
  `;
  render() {
    return (
      <div class="loading">
        {this.renderStyle()}
        <img src={loaderImg} />
      </div>
    );
  }
}

export class Note extends Component {
  css = `
    .note {
      background-color: #DCE4CA;
      border-left: 3px solid #c6d3a8;
      display: block;
      margin: 20px 0;
      padding: 10px 15px;
    }
  `;
  render() {
    return (
      <em class="note">
        {this.renderStyle()}
        <slot />
      </em>
    );
  }
}
