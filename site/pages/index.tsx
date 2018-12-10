import { readFileSync } from 'fs';
import css from 'shadow-css';
import { Runnable } from '../components/code';
import { Layout } from '../components/layout';
import { Marked } from '../components/marked';
import { Hr } from '../components/primitives';
import { Component, h } from '../utils';

import './docs/__samples__/element-preact';
const codeSample = readFileSync(
  __dirname + '/docs/__samples__/element-preact.tsx'
).toString();
const codeSampleHtml = readFileSync(
  __dirname + '/docs/__samples__/element-preact.html'
).toString();
const README = readFileSync(__dirname + '/../../README.md').toString();

const style = css(`
  .code {
    margin: 0 auto;
    overflow: hidden;
    max-width: 600px;
  }
  .hero {
    margin: 60px 0;
    text-align: center;
  }
  .subtitle {
    font-size: 1.4em;
    margin-top: 30px;
  }
  .title {
    margin-bottom: 30px;
  }
`);

export default class Index extends Component {
  render() {
    return (
      <div>
        <style>{this.renderStyle(style)}</style>
        <div class="hero">
          <h1 class="title">SkateJS</h1>
          <h2 class="subtitle">
            Effortless custom elements for modern view libraries.
          </h2>
        </div>
        <Runnable class="code" code={codeSample} html={codeSampleHtml} />
        <Hr />
        <Layout>
          <Marked src={README} />
        </Layout>
      </div>
    );
  }
}
