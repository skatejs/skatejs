// @flow

import '../../components/code';
import '../../components/layout';

import { define } from 'skatejs';

import { Component } from '../../utils';

import './__samples__/with-context';
import codeWithComponent from '!raw-loader!./__samples__/with-context';
import codeWithComponentHtml from '!raw-loader!./__samples__/with-context.html';

export default define(
  class extends Component {
    static is = 'x-pages-mixins-context';
    render() {
      return this.$`
        ${this.$style}
        <x-layout title="Context">
          <p>
            The <code>withContext</code> mixin allows you to use
            <code>context</code> like in <a href="https://reactjs.org/">React</a>.
          </p>
          <x-runnable
            code="${codeWithComponent}"
            html="${codeWithComponentHtml}"
          ></x-runnable>
        </x-layout>
      `;
    }
  }
);
