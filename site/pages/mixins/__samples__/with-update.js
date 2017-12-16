import { props, shadow, withUpdate } from 'skatejs';

class WithUpdate extends withUpdate() {
  static get props() {
    return {
      name: props.string
    };
  }
  updated() {
    return (shadow(this).innerHTML = `Hello, ${this.name}!`);
  }
}

customElements.define('with-update', WithUpdate);
