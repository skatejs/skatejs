// @flow

import '../../components/code';
import '../../components/layout';
import '../../components/marked';

import { define } from 'skatejs';

import { Component } from '../../utils';

import './__samples__/with-update';
import codeWithUpdate from '!raw-loader!./__samples__/with-update';
import codeWithUpdateHtml from '!raw-loader!./__samples__/with-update.html';

@define
export default class extends Component {
  static is = 'x-pages-mixins-update';
  render() {
    return this.$`
      <x-layout title="Update">
        <x-marked src="${`
          The <code>withUpdate</code> mixin is the heart of Skate and is what
          makes attribute / property linkage and reflection manageable by
          enforcing a convention that follows best-practices. It also exports
          several pre-defined property types that handle serialisation and
          deserialisation to / from attributes when they're set, as well as
          coercion when the property is set. When properties update, everything
          funnels into a single set of functions that are called so that you can
          update your component in a functional manner.
        `}"></x-marked>
        <x-runnable
          code="${codeWithUpdate}"
          html="${codeWithUpdateHtml}"
        ></x-runnable>
        <x-marked src="${`
          In the above example, we use the bare minimum setup and use the \`updated()\` callback to implement a very simple renderer. We've done this for the sake of example. If you want to implement your own renderer, you should use the \`withRenderer\` mixin.

          That's why when you use the \`withComponent\` mixin, you get both \`withRenderer\` and \`withUpdate\` and can just do something like:

          \`\`\`js
          class WithUpdate extends withComponent() {
            static props = {
              name: props.string
            };
            render() {
              return \`Hello, \${this.name}!\`;
            }
          }
          \`\`\`

          ### Maintaining internal state

          Up until now, we've just seen props. However, that is your public API. If you update your public API from within your component, you're likely breaking the expectations of your consumers. For this reason, Skate provides a way to maintain internal state just like in other functional UI abstractions like Preact and React.

          \`\`\`js
          import { withComponent } from 'skatejs';

          class Input extends withComponent(withPreact()) {
            state = {
              value: ''
            };
            constructor() {
              super();
              this.addEventListener('change', e => {
                this.state = {
                  value: e.target.value
                };
              });
            }
            render({ state }) {
              return \`<input value={state.value}>\`;
            }
          }
          \`\`\`

          ### Mixing state and props

          In the above example, there's no way for a consumer to specify a value, or a default value. There's two scenarios you may want to cover.

          1. Props overrides state. This is a controlled component.
          2. State overrides props. This is an uncontrolled component.

          In a controlled setting, you're allowing the consumer to override your internal state. Your render may look something like:

          \`\`\`js
          render({ props, state }) {
            return \`<input value="\${props.value || state.value}">\`;
          }
          \`\`\`

          In an uncontrolled setting, you'd have the state override the props:

          \`\`\`js
          render({ props, state }) {
            return \`<input value="\${state.value || props.value}">\`;
          }
          \`\`\`

          In a real-world scenario, there may be more intriciacies to the implementation than what's shown here. The key here is that if you're allowing both, you're going to want one to take precedence over the other depending on your needs.

          ### Preventing updates with shouldUpdate()

          Something common to functional UI abstractions is the ability to prevent updates because some updates can be expensive and you may not want to unnecessarily update.

          This example isn't necessarily expensive, however it shows how you can prevent a render based on the previous and current state. This will only update / render if the state has actually changed.

          \`\`\`js
          import { withComponent } from 'skatejs';

          class Input extends withComponent() {
            state = {
              value: ''
            };
            constructor() {
              super();
              this.addEventListener('change', e => {
                this.state = {
                  value: e.target.value
                };
              });
            }
            shouldUpdate(prevProps, prevState) {
              return prevState.value !== this.state.value
            }
            render({ state }) {
              return \`<input value={state.value}>\`;
            }
          }
          \`\`\`

          ### Executing something on *all* updates with updating()

          The \`withUpdate\` mixin provides an \`updating()\` callback that is executed on every single update. It is called before \`shouldUpdate()\` and even if it returns \`false\`.

          ### Built-in props

          Skate ships with several built-in props that solve many of the common situations that you'll encounter.

          All built-in props exhibint the following behaviour with attributes:

          1. They're linked to an attribute that has the same name as the property, but dash-cased.
          2. Attribute binding is one-way: attribute updates affect the property, but not the other way around.

          #### any

          This provides you a way to have the default prop behaviour while allowing any value to come in.

          #### array

          The \`array\` prop ensures that whatever is passed to the prop is coerced to an array. This means that a string would be made into an array where it is the only item in the array. When linked to an attribute, the value is JSON parsed / stringified as necessary.

          #### boolean

          The \`boolean\` prop coerces all values to a boolean. Attributes, when true, are void. When false, they're removed.

          #### number

          The \`number\` prop coerces all values to be a number.

          #### object

          The \`object\` prop ensures that a default, empty object is available. It doesn't coerce any values, like the \`array\` prop, but it does ensure that attribute values are JSON parsed / stringified.

          #### string

          The \`string\` prop ensures that whatever value is passed is coerced to a string.
        `}"></x-marked>
      </x-layout>
    `;
  }
}
