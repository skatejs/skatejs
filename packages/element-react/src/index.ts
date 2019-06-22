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
    // @ts-ignore
    render(null, this.renderRoot);
  }
  renderer() {
    // @ts-ignore
    render(this.render(), this.renderRoot);
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

  // If it extends HTMLElement.
  if (name.prototype instanceof HTMLElement) {
    const customElementName = getName(define(name));

    // Not being able to retrieve a name from a defined element is an
    // exceptional state.
    if (!customElementName) {
      throw new Error(`Could not find name for: ${name}`);
    }

    // We only try and convert the custom element to a string if we're on the
    // server. We leave it it to the custom element to determine how it should
    // be rendered to a string, so this can be compatible with any web
    // component framework.
    if (isSsr && name.prototype.renderToString) {
      currentLightDOM = chren;
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

  if (isSsr && name === "slot") {
    return createElement(
      name,
      props,
      ...(currentLightDOM.filter(d => {
        const dSlot = d.props && d.props.slot;
        return props && props.name ? props.name === dSlot : !dSlot;
      }) || chren)
    );
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
