import { define } from 'skatejs';
import '../../components/code';
import '../../components/layout';
import '../../components/primitives';
import { Component } from '../../utils';
import './__samples__/with-preact';

const codeWithPreact = fs.readFileSync('./__samples__/with-preact');
const codeWithPreactHtml = fs.readFileSync('./__samples__/with-preact.html');

export default define(
  class extends Component {
    static is = 'x-pages-renderers-preact';
    render() {
      return this.$`
      ${this.$style}
      <x-layout title="Preact renderer">
        <p>
          The
          <a href="https://github.com/skatejs/renderer-preact">Preact renderer</a>
          allows you to render using
          <a href="https://github.com/developit/preact">Preact</a>.
        </p>
        <x-runnable
          code="${codeWithPreact}"
          html="${codeWithPreactHtml}"></x-runnable>
      </x-layout>
    `;
    }
  }
);
