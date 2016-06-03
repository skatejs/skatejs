import * as symbols from './symbols';
import data from '../util/data';

export default class Component extends HTMLElement {
  constructor () {
    super();

    const elemData = data(this);
    const readyCallbacks = elemData.readyCallbacks;
    const Ctor = this.constructor;
    const { definedAttribute, events, created, props, ready, renderedAttribute } = this.constructor;
    const renderer = Ctor[symbols.renderer];

    if (elemData.created) {
      return;
    }

    elemData.created = true;

    if (props) {
      Ctor[symbols.props](this);
    }

    if (events) {
      Ctor[symbols.events](this);
    }

    if (created) {
      created(this);
    }

    if (renderer && !this.hasAttribute(renderedAttribute)) {
      renderer(this);
    }

    if (ready) {
      ready(this);
    }

    if (!this.hasAttribute(definedAttribute)) {
      this.setAttribute(definedAttribute, '');
    }

    if (readyCallbacks) {
      readyCallbacks.forEach(cb => cb(this));
      delete elemData.readyCallbacks;
    }
  }
}

Component.definedAttribute = 'defined';
Component.events = {};
Component.extends = null;
Component.observedAttributes = [];
Component.props = {};
Component.renderedAttribute = 'rendered';
