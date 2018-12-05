import name from './name';

export interface Constructor<T> {
  new (): T;
  is?: string;
  name: string;
}

export default function<T>(ctor: Constructor<T>): Constructor<T> {
  if (!ctor.is) {
    ctor.is = name(ctor.name);
    customElements.define(ctor.is, ctor);
  }
  return ctor;
}
