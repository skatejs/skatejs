const { define, props, withComponent } = require('skatejs');
const outdent = require('outdent');

class Centered extends HTMLElement {
  static is = 'x-centered';
  connectedCallback() {
    const slot = document.createElement('slot');
    const style = document.createElement('style');

    style.innerHTML = `
      :host {
        text-align: center;
      }
    `;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(slot);
  }
}

class Namecard extends withComponent() {
  render() {
    return outdent`
      <x-centered>
        <h1><slot name="name"></slot></h1>
        <x-slant><slot name="description"></slot></x-slant>
      </x-centered>
    `;
  }
}

class Nametag extends withComponent() {
  static props = {
    name: { ...props.string, default: 'John Doe' },
    description: { ...props.string, default: 'Web Components enthusiast' }
  };
  render({ name, description }) {
    return `
      <x-namecard>
        <p slot="description">${description}</p>
        <strong slot="name">${name}</strong>
      </x-namecard>
    `;
  }
}

class Slant extends HTMLElement {
  static is = 'x-slant';
  connectedCallback() {
    const slot = document.createElement('slot');
    const em = document.createElement('em');

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(em);
    em.appendChild(slot);
  }
}

[Centered, Namecard, Nametag, Slant].forEach(define);

module.exports = Nametag;
