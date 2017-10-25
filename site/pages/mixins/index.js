import { component, h } from '../../utils';
import { Runnable } from '../../components/code';
import { Link } from '../../components/primitives';

// import '../../test/samples/with-children';
// import codeWithChildren from '!raw-loader!../../test/samples/with-children';
// import codeWithChildrenHtml from '!raw-loader!../../test/samples/with-children/index.html';
//
// import '../../test/samples/with-component';
// import codeWithComponent from '!raw-loader!../../test/samples/with-component';
// import codeWithComponentHtml from '!raw-loader!../../test/samples/with-component/index.html';
//
// import '../../test/samples/with-props';
// import codeWithProps from '!raw-loader!../../test/samples/with-props';
// import codeWithPropsHtml from '!raw-loader!../../test/samples/with-props/index.html';
//
// import '../../test/samples/with-renderer';
// import codeWithRenderer from '!raw-loader!../../test/samples/with-renderer';
// import codeWithRendererHtml from '!raw-loader!../../test/samples/with-renderer/index.html';
//
// import '../../test/samples/with-state';
// import codeWithState from '!raw-loader!../../test/samples/with-state';
// import codeWithStateHtml from '!raw-loader!../../test/samples/with-state/index.html';
//
// import '../../test/samples/with-unique';
// import codeWithUnique from '!raw-loader!../../test/samples/with-unique';
// import codeWithUniqueHtml from '!raw-loader!../../test/samples/with-unique/index.html';
//
// import codeWithReact from '!raw-loader!../../test/samples/with-react';
//
// const examples = [
//   {
//     name: 'withChildren',
//     pane: [
//       <p>
//         The <code>withChildren</code> mixin allows you to react to changes to
//         your component's <code>children</code> by implementing a{' '}
//         <code>childrenChangedCallback</code>.
//       </p>,
//       <Runnable.is code={codeWithChildren} html={codeWithChildrenHtml} />
//     ]
//   },
//   {
//     name: 'withComponent',
//     pane: [
//       <p>
//         The <code>withComponent</code> mixin combines all of Skate's mixins into
//         a single one for easy use. It's likely that this will be the most common
//         mixin you'll pair with renderers when authoring components, unless you
//         prefer to be selective about exactly which mixins you piece together.
//       </p>,
//       <Runnable.is code={codeWithComponent} html={codeWithComponentHtml} />
//     ]
//   },
//   {
//     name: 'withProps',
//     pane: [
//       <p>
//         The <code>withProps</code> mixin is the heart of Skate and is what makes
//         attribute / property linkage and reflection manageable by enforcing a
//         convention that follows best-practices. It also exports several
//         pre-defined property types that handle serialisation and deserialisation
//         to / from attributes when they're set, as well as coercion when the
//         property is set. When properties update, everything funnels into a
//         single set of functions that are called so that you can update your
//         component in a functional manner.
//       </p>,
//       <Runnable.is code={codeWithProps} html={codeWithPropsHtml} />
//     ]
//   },
//   {
//     name: 'withRenderer',
//     pane: [
//       <p>
//         The <code>withRenderer</code> mixin is what connects view libraries such
//         as React, Preact and Lit HTML to the rest of Skate. It implements a{' '}
//         <code>propsUpdatedCallback</code> so it can be paired up with the{' '}
//         <code>withProps</code> mixin, or you can call it imperatively yourself
//         if not.
//       </p>,
//       <p>
//         To see the stark difference when paired with the <code>withProps</code>{' '}
//         mixin, look at the <code>withComponent</code> or <code>withProps</code>{' '}
//         minxins.
//       </p>,
//       <Runnable.is code={codeWithRenderer} html={codeWithRendererHtml} />
//     ]
//   },
//   {
//     name: 'withState',
//     pane: [
//       <p>
//         The <code>withState</code> mixin enables the idea of internal state,
//         much like the idea of state in React and other similar libraries. When
//         state is updated, it calls a method on the instance called{' '}
//         <code>triggerUpdate</code> if it's defined.
//       </p>,
//       <Runnable.is code={codeWithState} html={codeWithStateHtml} />
//     ]
//   },
//   {
//     name: 'withUnique',
//     pane: [
//       <p>
//         The <code>withUnique</code> mixin allows you to define custom elements
//         without having to specify a name. It defines a static <code>is</code>{' '}
//         property that will return a unique name for the element.
//       </p>,
//       <Runnable.is code={codeWithUnique} html={codeWithUniqueHtml} />
//     ]
//   }
// ];

const Spec = ({ children: [spec, link] }) => (
  <span>
    <code>{spec}</code> &rarr;{' '}
    <Link.is href={`/mixins/with-${link}`}>
      with{link[0].toUpperCase() + link.substring(1)}
    </Link.is>
  </span>
);

export default component(function mixins() {
  return (
    <div>
      <style>{this.context.style}</style>
      <h2>Mixins</h2>
      <p>
        As stated previously, the mixin pattern is a way to take several class
        definitions and compose them into one. It works well for custom elements
        because every element has a different purpose and it allows you to pick
        and choose what goes into it.
      </p>
      <p>
        Skate's mixins follow a common component lifecycle specification, which
        enables it to interop with not only itself, but also other libraries.
        The specification is described as follows and is what you get if you
        combine all of the mixins together, or use the{' '}
        <code>withComponent</code> mixin.
      </p>
      <ul>
        <li>
          <Spec>{['static is', 'unique']}</Spec>
        </li>
        <li>
          <Spec>{['static props', 'props']}</Spec>
        </li>
        <li>
          <Spec>{['context', 'context']}</Spec>
        </li>
        <li>
          <Spec>{['props', 'props']}</Spec>
        </li>
        <li>
          <Spec>{['state', 'state']}</Spec>
        </li>
        <li>
          <Spec>{['childrenChangedCallback()', 'children']}</Spec>
        </li>
        <li>
          <Spec>{['componentShouldUpdateCallback()', 'props']}</Spec>
        </li>
        <li>
          <Spec>{['componentUpdatedCallback()', 'props']}</Spec>
        </li>
        <li>
          <Spec>{['propsSetCallback()', 'props']}</Spec>
        </li>
        <li>
          <Spec>{['renderCallback()', 'renderer']}</Spec>
        </li>
        <li>
          <Spec>{['renderedCallback()', 'renderer']}</Spec>
        </li>
        <li>
          <Spec>{['rendererCallback()', 'renderer']}</Spec>
        </li>
        <li>
          <Spec>{['triggerUpdateCallback()', 'props']}</Spec>
        </li>
      </ul>
    </div>
  );
});
