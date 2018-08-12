import { define } from 'skatejs';
import '../../components/code';
import '../../components/layout';
import '../../components/primitives';
import { Component } from '../../utils';
import './__samples__/with-react';
import './__samples__/wrap-react';

const codeWithReact = fs.readFileSync('./__samples__/with-react');
const codeWithReactHtml = fs.readFileSync('./__samples__/with-react.html');

const codeWrapReact = fs.readFileSync('./__samples__/wrap-react');
const codeWrapReactHtml = fs.readFileSync('./__samples__/wrap-react.html');

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

        <p>
          The React renderer also exports a <code>wrap</code> function
          which takes a React component and returns a Custom Element which renders
          the given React component on <code>render</code>
        </p>
        <x-runnable
          code="${codeWrapReact}"
          html="${codeWrapReactHtml}"></x-runnable>
      </x-layout>
    `;
    }
  }
);
