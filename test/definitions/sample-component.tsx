import * as skate from "skatejs";

(window as any).__extends = function(d: any, b: any) {
  Object.setPrototypeOf(d, b);
  var __: any = function() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

interface CountUpProps {
  count: number;
}

class CountUpComponent extends skate.Component<CountUpProps> {
  static get props(): skate.ComponentProps<CountUpComponent, CountUpProps> {
    return {
      count: skate.prop.number({
        attribute: true,
        default(elem, data) {
          return 7;
        },
      }),
    }
  }

  count: number;

  click() {
    this.count += 1;
  }

  renderCallback(): any {
    return (
      <div>
        <p>Count: <span>{this.count}</span></p>
        <button onClick={e => this.click()}>Count up</button>
      </div>
    );
  }
}
customElements.define("x-countup", CountUpComponent);

customElements.define("x-app", class extends skate.Component<{}> {
  renderCallback() {
    return (
      <div>
        <h1>app</h1>
        <CountUpComponent count={100}></CountUpComponent>
      </div>
    );
  }
});
