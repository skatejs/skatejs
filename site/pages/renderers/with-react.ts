import fs from 'fs';
import { define } from 'skatejs';
import '../../components/code';
import '../../components/layout';
import '../../components/primitives';
import { Component } from '../../utils';
import './__samples__/react';

const codeWithReact = fs.readFileSync('./__samples__/react.tsx');
const codeWithReactHtml = fs.readFileSync('./__samples__/react.html');

export default define(
  class extends Component {
    static is = 'x-pages-renderers-react';
    render() {
      return this.$`
      ${this.$style}
        <x-layout title="React renderer">
          <p>
            The
            <a href="https://github.com/skatejs/renderer-react">React renderer</a>
            allows you to render using <a href="https://reactjs.org/">React</a>.
          </p>
          <x-runnable
            code="${codeWithReact}"
            html="${codeWithReactHtml}"></x-runnable>
        </x-layout>
      `;
    }
  }
);
