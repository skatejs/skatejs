/** @jsx vh */

const { Component, define, h, props } = require('skatejs');
const vh = require('@skatejs/val').default(h);

const Slant = define(
  class extends HTMLElement {
    static is = 'x-slant';
    connectedCallback() {
      const slot = document.createElement('slot');
      const em = document.createElement('em');

      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(em);
      em.appendChild(slot);
    }
  }
);

const Centered = define(
  class extends HTMLElement {
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
);

const Namecard = define(
  class extends Component {
    renderCallback() {
      return (
        <Centered>
          <h1>
            <slot attrs={{ name: 'name' }} />
          </h1>
          <Slant>
            <slot attrs={{ name: 'description' }} />
          </Slant>
        </Centered>
      );
    }
  }
);

module.exports = define(
  class extends Component {
    static props = {
      name: { ...props.string, default: 'John Doe' },
      description: { ...props.string, default: 'Web Components enthusiast' }
    };
    renderCallback({ name, description }) {
      return (
        <Namecard>
          <p attrs={{ slot: 'description' }}>{description}</p>
          <strong attrs={{ slot: 'name' }}>{name}</strong>
        </Namecard>
      );
    }
  }
);
