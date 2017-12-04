// @flow

import '../../components/layout';
import '../../components/marked';

import { define } from 'skatejs';

import { Component } from '../../utils';

export default define(
  class extends Component {
    static is = 'x-pages-utils-define';
    render() {
      return this.$`
        <x-layout title="define()">
          <x-marked src="${`
            The \`define()\` function takes a custom element constructor and defines it using the value of the \`static is\` class property that you define on your element.

            \`\`\`js
            import { define } from 'skatejs';

            export default define(
              class extends HTMLElement {
                static is = 'my-element';
              }
            );
            \`\`\`

            If you're into the whole decorator thing, you can also use it like one:

            \`\`\`js
            @define
            export default class extends HTMLElement {
              static is = 'my-element';
            }
            \`\`\`
          `}"></x-marked>
        </x-layout>
      `;
    }
  }
);
