// @flow

import '../../components/code';
import '../../components/layout';

import { define } from 'skatejs';

import { Component } from '../../utils';

import './__samples__/with-update';
import codeWithUpdate from '!raw-loader!./__samples__/with-update';
import codeWithUpdateHtml from '!raw-loader!./__samples__/with-update.html';

export default define(
  class extends Component {
    static is = 'x-pages-mixins-update';
    render() {
      return this.$`
        ${this.$style}
        <x-layout title="Update">
          <p>
            The <code>withUpdate</code> mixin is the heart of Skate and is what
            makes attribute / property linkage and reflection manageable by
            enforcing a convention that follows best-practices. It also exports
            several pre-defined property types that handle serialisation and
            deserialisation to / from attributes when they're set, as well as
            coercion when the property is set. When properties update, everything
            funnels into a single set of functions that are called so that you can
            update your component in a functional manner.
          </p>
          <x-runnable
            code="${codeWithUpdate}"
            html="${codeWithUpdateHtml}"
          ></x-runnable>
        </x-layout>
      `;
    }
  }
);
