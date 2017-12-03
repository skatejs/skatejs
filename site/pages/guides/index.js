// @flow

import '../../components/layout';
import '../../components/marked';

import { component } from '../../utils';

export default component(function guidesIndex() {
  return this.$`
    <x-layout title="Guides">
      <x-marked src="${`
        The "Guides" section is aimed at exposing you to patterns, tooling and other useful aspects of being a SkateJS consumer. For example, if you want to know how to automatically define Skate \`props\` using your Flow props, you'd find it here.
      `}"></x-marked>
    </x-layout>
  `;
});
