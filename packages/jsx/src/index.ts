import define, { getName } from "@skatejs/define";

export default function jsx(createElement) {
  // Uses this in lieu of context because separate renderToString calls cannot
  // share context.
  let lightDomToSlotLater;

  return function h(name, props, ...chren) {
    // We check to see if it's a custom element by checking to see if it has
    // a connected callback. We can't check HTMLElement because we might be in
    // Node and that may be stubbed.
    const isCustomElement = name.prototype && name.prototype.connectedCallback;

    // This is generally reliable. If window is present, then we assume that
    // there is a DOM implementation present to handle everything we need.
    const isSsr = typeof window === "undefined";

    // We only try and convert the custom element to a string if we're on the
    // server. It decides how to render itself to a string which means this
    // could render a web component built with any (or no) framework.
    const canSsr = isSsr && name.renderToString;

    // If we encounter a slot, we want to try and attempt to simulate slotting
    // by filtering light DOM into it. This will get reversed on the client
    // when the custom element is constructed.
    const canSimulateSlotProjection = isSsr && name === "slot";

    if (isCustomElement) {
      // Doing this lazily allows us to not have to worry about a global
      // registry for any custom element, and prevents naming conflicts.
      const customElementName = getName(define(name));

      // Though extremely unlikely, it's still possible to not be able to get
      // a name.
      if (!customElementName) {
        throw new Error(
          `Could not generate or find a name for the custom element: ${name}`
        );
      }

      if (canSsr) {
        lightDomToSlotLater = chren;

        // We have to dangerouslySetInnerHTML as this is the only way to get
        // a string into React. The caveat here is that you cannot pass down
        // children, so you must rely on either slots or other props.
        return createElement(customElementName, {
          ...props,
          dangerouslySetInnerHTML: { __html: name.renderToString(props) }
        });
      }

      // If we get here, it means we're on the client but we've encountered
      // a custom element, so we just create it using its name since it
      // doesn't understand custom element constructors.
      return createElement(customElementName, props, ...chren);
    }

    if (canSimulateSlotProjection) {
      chren = lightDomToSlotLater.filter(d => {
        const dSlot = d.props && d.props.slot;
        return props && props.name ? props.name === dSlot : !dSlot;
      });
      return createElement(name, props, ...chren);
    }

    return createElement(name, props, ...chren);
  };
}

export declare namespace jsx {
  namespace JSX {
    interface Element {
      key: any;
      props: any;
      type: any;
    }
    type LibraryManagedAttributes<E, _> = E extends {
      props: infer Props;
      prototype: infer Prototype;
    }
      ? Pick<Prototype, Extract<keyof Prototype, keyof Props>>
      : _;
  }
}

const symRef = Symbol();
export function setProps(domProps, refCallback?) {
  refCallback = refCallback || (refCallback = () => {});
  return (
    refCallback[symRef] ||
    (refCallback[symRef] = e => {
      refCallback(e);
      if (e) {
        Object.assign(e, domProps);
      }
    })
  );
}
