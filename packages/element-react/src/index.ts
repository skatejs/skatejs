import define, { getName } from '@skatejs/define';
import Element from '@skatejs/element';
import { createContext, createElement } from 'react';
import { render } from 'react-dom';
import { renderToString } from 'react-dom/server';

const Context = createContext<{}>(null);

export default class extends Element {
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
  static renderToString(
    name: string,
    props: { [s: string]: any },
    chren: Array<any>
  ) {
    const elem = new this();
    Object.assign(elem, props);
    return (
      renderToString(
        // We have to pass the children down so that slots can intercept them
        // and render them inside themselves. We do it this way so that SEO
        // isn't screwed up by out-of-order content.
        h(Context.Provider, { value: chren }, elem.render())
      )
        // Not sure if we need to do this.
        .replace(/\sdata-reactroot=""/g, '')
    );
  }
}

export function h(name, props, ...chren) {
  const isSsr = typeof window === 'undefined';
  if (name.prototype instanceof HTMLElement) {
    const Component = name;
    name = getName(define(name));

    // We only try and convert the custom element to a string if we're on the
    // server. We leave it it to the custom element to determine how it should
    // be rendered to a string, so this can be compatible with any web
    // component framework.
    if (isSsr && Component.renderToString) {
      props = {
        ...props,

        // No other way to get a string into React.
        dangerouslySetInnerHTML: {
          __html: Component.renderToString(name, props, chren)
        }
      };

      // We cant dangerouslySetInnerHTML and have children.
      chren = null;
    }
  } else if (isSsr && name === 'slot') {
    // If we're rendering a slot, we try and get any children that should be
    // projected into it via context.
    const oldChren = chren;
    chren = [
      h(Context.Consumer, null, lightDom => {
        return (
          lightDom.filter(d => {
            return props && props.name
              ? props.name === d.props.slot
              : !d.props.slot;
          }) || oldChren
        );
      })
    ];
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
