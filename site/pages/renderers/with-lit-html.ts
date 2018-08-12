import { define } from 'skatejs';
import '../../components/code';
import '../../components/layout';
import '../../components/primitives';
import { Component } from '../../utils';
import './__samples__/with-lit-html';

const codeWithLitHtml = fs.readFileSync('./__samples__/with-lit-html');
const codeWithLitHtmlHtml = fs.readFileSync('./__samples__/with-lit-html.html');

export default define(
  class extends Component {
    static is = 'x-pages-renderers-lit-html';
    render() {
      return this.$`
      ${this.$style}
      <x-layout title="LitHTML renderer">
        <p>
          The
          <a href="https://github.com/skatejs/renderer-lit-html">
            LitHTML renderer
          </a>
          allows you to render using
          <a href="https://github.com/PolymerLabs/lit-html">LitHTML</a>.
        </p>

        <p>
          Please note this renderer uses Lit HTML's extended renderer by default. This provides slightly different
          than default, and enhanced, functionality as described
          <a href="https://github.com/PolymerLabs/lit-html/blob/master/src/lib/lit-extended.ts#L25">
            here
          </a>.
        </p>
        <x-runnable
          code="${codeWithLitHtml}"
          html="${codeWithLitHtmlHtml}"></x-runnable>
      </x-layout>
    `;
    }
  }
);
