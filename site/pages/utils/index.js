// @flow

import '../../components/layout';
import '../../components/marked';

import { component, style } from '../../utils';

export default component(function utilsIndex() {
  return this.$`
    <x-layout title="Utilities">
      <x-marked src="${`
        Skate includes a few utilities that you'll end up needing when you build
        complex components. They're minimal, opt-in and augment your building of
        web components, not required by it.

        - [define()](/utils/define)
        - [emit()](/utils/emit)
        - [link()](/utils/link)
        - [shadow()](/utils/shadow)
      `}"></x-marked>
    </x-layout>
  `;
});
