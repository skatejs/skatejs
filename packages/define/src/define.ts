import name from './name';

export interface Constructor {
  new (): HTMLElement;
  is?: string;
  name: string;
}

export default function(ctor: Constructor): Constructor {
  if (!ctor.is) {
    ctor.is = name(ctor.name);
    customElements.define(ctor.is, ctor);
  }
  return ctor;
}
