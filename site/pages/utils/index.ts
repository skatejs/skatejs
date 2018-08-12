import { define } from 'skatejs';
import '../../components/layout';
import '../../components/marked';
import { Component } from '../../utils';

export default define(
  class extends Component {
    static is = 'x-pages-utils-index';
    render() {
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
    }
  }
);
