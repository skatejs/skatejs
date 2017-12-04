// @flow

import '../../components/code';
import '../../components/layout';

import { define } from 'skatejs';

import { Component } from '../../utils';

import './__samples__/with-component';
import codeWithComponent from '!raw-loader!./__samples__/with-component';
import codeWithComponentHtml from '!raw-loader!./__samples__/with-component.html';

export default define(
  class extends Component {
    static is = 'x-pages-mixins-component';
    render() {
      return this.$`
        ${this.$style}
        <x-layout title="Component">
          <p>
            The <code>withComponent</code> mixin combines all of Skate's mixins into
            a single one for easy use. It's likely that this will be the most common
            mixin you'll pair with renderers when authoring components, unless you
            prefer to be selective about exactly which mixins you piece together.
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
