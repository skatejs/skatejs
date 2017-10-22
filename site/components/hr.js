import { Component, h, style } from '../utils';
import { define } from '../../src';

export const Hr = define(
  class Hr extends Component {
    renderCallback() {
      return (
        <div class="hr">
          {style(
            this,
            `
            .hr {
              letter-spacing: 10px;
              margin: 50px 0;
              text-align: center;
            }
          `
          )}
          &mdash;&mdash;&mdash;
        </div>
      );
    }
  }
);
