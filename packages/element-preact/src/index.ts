import define, { getName } from "@skatejs/define";
import Element from "@skatejs/element";
import { h as preactH, render } from "preact";

const mapDom = new WeakMap();

export default class extends Element {
  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    render(null, this.renderRoot, mapDom.get(this));
  }
  renderer() {
    mapDom.set(this, render(this.render(), this.renderRoot, mapDom.get(this)));
  }
}

export function h(name, props, ...chren) {
  if (name.prototype instanceof HTMLElement) {
    name = getName(define(name));
  }
  return preactH(name, props, ...chren);
}

// export declare namespace h {
//   namespace JSX {
//     interface Element {
//       key: any;
//       props: any;
//       type: any;
//     }
//     type LibraryManagedAttributes<E, _> = E extends {
//       props: infer Props;
//       prototype: infer Prototype;
//     }
//       ? Pick<Prototype, Extract<keyof Prototype, keyof Props>>
//       : _;
//   }
// }
