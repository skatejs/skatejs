import * as skate from "skatejs";
import { Component, prop } from 'skatejs';

// @TODO this override is needed because of https://github.com/Microsoft/TypeScript/pull/12488 will be fixed in TS 2.2
(window as any).__extends = function(d: any, b: any) {
  Object.setPrototypeOf(d, b);
  var __: any = function() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

interface CountUpProps {
  count: number;
}

class CountUpComponent extends skate.Component<CountUpProps> {
  static get is() { return 'x-countup' }
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
        <CounterOutput count={this.count} />
        <Button onClick={e => this.click()}>Count up</Button>
      </div>
    );
  }
}
customElements.define(CountUpComponent.is, CountUpComponent);

type SkateParkProps = { year: number, halfPipe: boolean }
class SkatePark extends Component<SkateParkProps>{
  static get is() { return 'my-skate-park' }
  static get props(): skate.ComponentProps<SkatePark, SkateParkProps> {
    return {
      year: prop.number(),
      halfPipe: prop.boolean(),
    }
  }
  renderCallback({halfPipe,year}:SkateParkProps) {
    const halfPipeInfo = <span>{halfPipe ? 'has' : 'doesnt have'}</span>;
    return (
      <div>
        <p>Skate park exists since {year} and it {halfPipe} Half-Pipe</p>
      </div>
    )
  }
}
customElements.define(SkatePark.is, SkatePark);

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


type ButtonProps = { onClick: (e: MouseEvent) => void };
const Button: skate.SFC<ButtonProps> = ({onClick}, children: any) => (
  <button onClick={onClick}>{children}</button>
);

type CounterOutputProps = { count: number };
const CounterOutput: skate.SFC<CounterOutputProps> = (props) => (
  <p>Count: <span>{props.count}</span></p>
);
