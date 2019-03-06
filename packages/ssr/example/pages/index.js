const define = require('@skatejs/define').default;
const Element = require('@skatejs/element').default;

class Centered extends HTMLElement {
  render() {
    return `
      <style>:host{text-align: center}</style>
      <slot></slot>
    `;
  }
}

class Namecard extends Element {
  render() {
    return `
      <x-centered>
        <h1><slot name="name"></slot></h1>
        <x-slant><slot name="description"></slot></x-slant>
      </x-centered>
    `;
  }
}

class Nametag extends Element {
  static get props() {
    return {
      name: String,
      description: String
    };
  }
  constructor() {
    super();
    this.description = 'Web Components enthusiast';
    this.name = 'John Doe';
  }
  render() {
    return `
      <x-namecard>
        <p slot="description">${this.description}</p>
        <strong slot="name">${this.name}</strong>
      </x-namecard>
    `;
  }
}

class Slant extends HTMLElement {
  render() {
    return `
      <em><slot></slot></em>
    `;
  }
}

[Centered, Namecard, Nametag, Slant].forEach(define);

module.exports = Nametag;
