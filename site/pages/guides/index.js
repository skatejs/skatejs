// @flow

import '../../components/layout';
import '../../components/marked';

import { define } from 'skatejs';

import { Component } from '../../utils';

export default define(
  class extends Component {
    static is = 'x-pages-guides';
    render() {
      return this.$`
        <x-layout title="Guides">
          <x-marked src="${`
            The "Guides" section is aimed at exposing you to patterns, tooling and other useful aspects of being a SkateJS consumer. For example, if you want to know how to automatically define Skate \`props\` using your Flow props, you'd find it here.
          `}"></x-marked>
        </x-layout>
      `;
    }
  }
);
