import { Component, h, style } from '../utils';
import { define } from '../../src';

style(`
  a {
    color: #F2567C;
    text-decoration: none;
  }
  body {
    background-color: #F2F5EB;
    font-family: Helvetica;
    font-size: 1.2em;
    font-style: normal;
    font-weight: lighter;
    line-height: 1.4em;
    margin: 0;
    padding: 0;
  }
  h1 {
    font-size: 2.5em;
    font-style: normal;
    font-weight: normal;
    line-height: 1em;
    margin: 10px 0;
  }
  h2 {
    font-size: 1.5em;
    font-style: normal;
    font-weight: lighter;
    margin: 10px 0;
  }
`);

export const Layout = define(
  class Layout extends Component {
    renderCallback() {
      return (
        <div class="outer">
          {style(
            this,
            `
            .outer {
              border-top: 5px solid #F2567C;
              padding: 25px;
            }
            .inner {
              max-width: 800px;
              margin: 0 auto;
            }
          `
          )}
          <div class="inner">
            <slot />
          </div>
        </div>
      );
    }
  }
);
