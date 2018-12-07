import Element, { h } from '@skatejs/element-preact';
import css from 'shadow-css';

const styles = css(`
  a {
    color: #F2567C;
    text-decoration: none;
  }
  blockquote {
    background-color: #DCE4CA;
    border-left: 3px solid #c6d3a8;
    font-size: smaller;
    font-style: italic;
    margin: 20px 0;
    padding: 10px 15px;
  }
  blockquote code {
    background-color: transparent;
    display: inline;
    padding: 0;
  }
  blockquote p {
    margin: 0;
  }
  code {
    background-color: #dce4c9;
    display: inline-block;
    font-family: monaco, Consolas, "Lucida Console", monospace;
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
    line-height: 1.2em;
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
`);

export { h } from '@skatejs/element-preact';
export class Component extends Element {
  _context?: any;
  _styles?: any;
  css?: any;
  state? = {};

  get context() {
    if (this._context) {
      return this._context;
    }
    let node = this;
    // @ts-ignore
    while ((node = node.parentNode || node.host)) {
      if ('context' in node) {
        return node.context;
      }
    }
    return {};
  }

  set context(context: any) {
    this._context = context;
  }

  getStyle(...args) {
    return [styles]
      .concat(args)
      .concat(this.css)
      .filter(Boolean)
      .reduce((prev, next) => {
        return prev + (typeof next === 'function' ? next(this) : next);
      }, '');
  }

  renderStyle(...args) {
    return <style>{this.getStyle(...args)}</style>;
  }
}
