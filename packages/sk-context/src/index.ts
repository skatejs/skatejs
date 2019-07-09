import Element, { props } from "@skatejs/element";
import { Event } from "@skatejs/globals";

export interface IConsumer {
  onchange: (e: CustomEventInit) => void | null;
}

export interface IConsumerConstructor {
  new (): IConsumer;
}

export interface IProvider {
  value: { [s: string]: any };
}

export interface IProviderConstructor {
  new (): IProvider;
}

export default function(
  defaultValue
): { Consumer: IConsumerConstructor; Provider: IProviderConstructor } {
  class Consumer extends Element implements IConsumer {
    static props = {
      onchange: Event
    };

    private provider: Provider;

    onchange = () => {};

    constructor() {
      super();
      this.triggerChange = this.triggerChange.bind(this);
    }

    connectedCallback() {
      let parent: Partial<HTMLElement> = this;

      if (super.connectedCallback) {
        super.connectedCallback();
      }

      // Displaying as contents ensures it doesn't mess with CSS layout.
      this.style.display = "contents";

      // Find the nearest provider, if one exists.
      // The `parent.host` is to break out of a shadow root.
      while ((parent = parent.parentNode || parent["host"])) {
        if (parent.constructor === Provider) {
          this.provider = parent as Provider;
          break;
        }
      }

      // If a provider is present, listen and trigger a change.
      // If not, it simply triggers with a default value.
      // In the event that a provider is added, the entire tree
      // will, at the very least, need to be reconnected, if
      // not re-created, so this will still work.
      if (this.provider) {
        this.provider.addEventListener("change", this.triggerChange);
        this.triggerChange({ detail: this.provider.value });
      } else {
        this.triggerChange({ detail: defaultValue });
      }
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      if (this.provider) {
        this.provider.removeEventListener("change", this.triggerChange);
      }
    }

    render() {
      return "<slot></slot>";
    }

    triggerChange({ detail }: CustomEventInit) {
      this.dispatchEvent(new CustomEvent("change", { detail }));
    }
  }

  class Provider extends Element {
    static props = {
      value: {
        ...props.any,
        changed(elem, name, oldValue, newValue) {
          elem.dispatchEvent(new CustomEvent("change", { detail: newValue }));
        }
      }
    };

    value = {};

    render() {
      return "<slot></slot>";
    }
  }

  return { Consumer, Provider };
}
