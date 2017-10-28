import { props, withUpdate } from '../../../src';

class WithProps extends withUpdate() {
  // This is where you declare your props.
  static props = {
    // This will define a handler for the name attribute that will set the name
    // prop. When the name prop is set, it will trigger an update allowing you
    // to react to the changes in shouldUpdate.
    name: props.string
  };

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // Called when props have been set regardless of if they've changed.
  willUpdate(props) {}

  // Called to check whether or not the component should call
  // shouldUpdate, much like React's shouldComponentUpdate.
  componentShouldUpdateCallback(nextProps, prevProps) {
    return !prevProps || nextProps.name !== prevProps.name;
  }

  // Called if shouldUpdate returned true.
  shouldUpdate() {
    this.shadowRoot.innerHTML = `Hey, ${this.name}!`;
  }
}

customElements.define('with-update', WithProps);
