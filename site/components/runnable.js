import { Code } from './code';
import { Example } from './example';
import { Component, h, style, withRehydration } from '../utils';
import { define, props } from '../../src';

export const Runnable = define(
  class Runnable extends withRehydration(Component) {
    static props = {
      code: props.string,
      html: props.string
    };
    renderCallback({ code, html }) {
      return (
        <div class="edge">
          {style(
            this,
            `
            .edge {
              border-radius: 3px;
              overflow: hidden;
            }
            .hr {
              border-bottom: 1px solid #555;
            }
          `
          )}
          <Code.is code={code} lang="js" />
          {html
            ? [
                <div class="hr" />,
                <Code.is code={html} lang="html" />,
                <div class="hr" />,
                <Example.is html={html} />
              ]
            : ''}
        </div>
      );
    }
  }
);
