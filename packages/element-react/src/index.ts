import define, { getName } from "@skatejs/define";
import SkateElement from "@skatejs/element";
import { createElement } from "react";
import { render } from "react-dom";
import { renderToString } from "react-dom/server";

export default class extends SkateElement {
  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    render(null, this.renderRoot as Element);
  }
  renderer() {
    render(this.render(), this.renderRoot as Element);
  }
  renderToString() {
    return renderToString(this.render());
  }
}

function constructCustomElement(Ctor, props) {
  const elem = new Ctor();
  Object.assign(elem, props);
  return elem;
}

// Uses this in lieu of context because separate renderToString calls cannot
// share context.
let currentLightDOM;

export function h(name, props, ...chren) {
  const isSsr = typeof window === "undefined";

  // We check to see if it's a custom element by checking to see if it has
  // a connected callback. We can't check HTMLElement because we might be in
  // Node and that would be stubbed.
  //
  // Checking connectedCallback is reliable, because if you're rendering
  // anything, you will need *at least* a connectedCallback. If it is not
  // rendering anything, then we don't need to do this.
  if (name.prototype && name.prototype.connectedCallback) {
    const customElementName = getName(define(name));

    // Not being able to retrieve a name from a defined element is an
    // exceptional state.
    if (!customElementName) {
      throw new Error(`Could not find name for: ${name}`);
    }

    // We only try and convert the custom element to a string if we're on the
    // server. It decides how to render itself to a string which means this
    // could render a web component built with any (or no) framework.
    if (isSsr && name.prototype.renderToString) {
      // We save the current children because we'll slot them later.
      currentLightDOM = chren;

      // We now render the current element to a string by simply invoking its
      // renderToString() method.
      return createElement(customElementName, {
        ...props,
        // No other way to get a string into React.
        dangerouslySetInnerHTML: {
          __html: constructCustomElement(name, props).renderToString()
        }
      });
    }

    // We're on the client, so just create as normal.
    return createElement(customElementName, props, ...chren);
  }

  // If we've encountered a slot, we filter out the light DOM we've saved
  // that should be projected into it. This simulates slotted content so
  // that content reads as intended to bots. The sk-shadow element can
  // reverse engineer this upon hydration.
  if (isSsr && name === "slot") {
    // TODO remove elements from the array as they are slotted.
    const filteredLightDOM = currentLightDOM.filter(d => {
      const dSlot = d.props && d.props.slot;
      return props && props.name ? props.name === dSlot : !dSlot;
    });

    // If there is light DOM, we render those instead of the normal
    // children (which would be the slot's default content).
    //
    // If there is no light DOM, we flag the slot as showing its default
    // content. This is so that the slot's content is not removed during
    // rehydration.
    if (filteredLightDOM.length) {
      chren = filteredLightDOM;
    } else {
      props.default = "";
    }

    return createElement(name, props, ...chren);
  }

  return createElement(name, props, ...chren);
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

export declare namespace h {
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
