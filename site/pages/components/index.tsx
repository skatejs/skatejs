import { define } from 'skatejs';
import '../../components/layout';
import '../../components/marked';
import { Component } from '../../utils';

export default define(
  class extends Component {
    static is = 'x-pages-components';
    render() {
      return this.$`
        <x-layout title="Components">
          <x-marked src="${`
            TODO
          `}"></x-marked>
        </x-layout>
      `;
    }
  }
);
