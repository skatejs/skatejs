import { Component, h, style } from '../utils';
import { define } from '../../src';

export const Hero = define(
  class Hero extends Component {
    renderCallback() {
      return (
        <div class="hero">
          {style(
            this,
            `
            .hero {
              margin: 50px 0;
              text-align: center;
            }
            .title {
              margin-bottom: 30px;
            }
          `
          )}
          <img
            height={100}
            src="https://cdn.rawgit.com/skatejs/branding/1efc884e/icon.png"
          />
          <h1 class="title">SkateJS</h1>
          <h2>Effortless custom elements for modern view libraries.</h2>
        </div>
      );
    }
  }
);
