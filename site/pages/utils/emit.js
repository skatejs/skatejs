// @flow

import '../../components/layout';
import '../../components/marked';

import { component } from '../../utils';

export default component(function utilsEmit() {
  return this.$`
    <x-layout title="emit()">
      <x-marked src="${`
        The \`emit()\` function dispatches an event on the specified element with the most common behaviour one will probably want from a DOM event, while still remaining just as customisable as doing it the longer, built-in way. By default it:

        1. Bubbles
        2. Is cancelable
        3. Does not propagate through shadow boundaries.

        It's designed to take a lot of the ceremony out of dispatching events. Also, the \`CustomEvent\` constructor isn't usable as a constructor in environments where custom elements aren't supported, so you'd have to take that into account, too.

        The Skate example is short, sweet and to the point:

        \`\`\`js
          import { emit } from 'skatejs';

          emit(elem, 'myevent', {
            detail: {}
          });
        \`\`\`

        _You can leave out \`detail\` if you don't need it._

        Compare this to the following, longer forms.

        ### Modern browsers

        \`\`\`js
          elem.dispatchEvent(new CustomEvent('myevent', {
            bubbles: true,
            cancelable: true,
            composed: false,
            detail: {}
          }));
        \`\`\`

        ### Non-native environments

        \`\`\`js
          const e = document.createEvent('CustomEvent');
          e.initCustomEvent('myevent', true, true, {});
          Object.defineProperty(e, 'composed', { value: false });
          elem.dispatchEvent(e);
        \`\`\`
      `}"></x-marked>
    </x-layout>
  `;
});
