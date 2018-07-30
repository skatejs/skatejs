// @flow

import '../../components/code';
import '../../components/layout';

import { define } from 'skatejs';

import { Component } from '../../utils';

import './__samples__/with-children/1';
import codeWithChildren from '!raw-loader!./__samples__/with-children/1';
import codeWithChildrenHtml from '!raw-loader!./__samples__/with-children/1.html';

import './__samples__/with-children/2';
import codeWithChildren2 from '!raw-loader!./__samples__/with-children/2';
import codeWithChildrenHtml2 from '!raw-loader!./__samples__/with-children/2.html';

// $FlowFixMe - decorators
@define
export default class extends Component {
  static is = 'x-pages-mixins-children';
  render() {
    return this.$`
      ${this.$style}
      <x-layout title="Children">
        <p>
          The <code>withChildren</code> mixin allows you to react to changes to
          your component's <code>children</code> by implementing a
          <code>childrenUpdated</code> lifecycle method.
        </p>
        <x-runnable code="${codeWithChildren}" html="${codeWithChildrenHtml}"></x-runnable>
        <h3>
          Integrating with <code>props</code>
        </h3>
        <p>
          If you use the <code>withChildren()</code> mixin with the
          <code>withUpdate</code> mixin and define a <code>children</code> prop,
          it will override the built in children prop so that it can trigger an
          update with the new child list. The overridden <code>children</code>
          props still returns the same value it normally would if it weren't
          overridden.
        </p>
        <x-runnable code="${codeWithChildren2}" html="${codeWithChildrenHtml2}"></x-runnable>
      </x-layout>
    `;
  }
}
