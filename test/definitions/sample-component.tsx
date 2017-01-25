import * as skate from "skatejs";

// @TODO this override is needed because of https://github.com/Microsoft/TypeScript/pull/12488 will be fixed in TS 2.2
(window as any).__extends = function(d: any, b: any) {
  Object.setPrototypeOf(d, b);
  var __: any = function() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


export type NumLiteral = 123 | 124 | 125;
export type StrLiteral = 'one' | 'two' | 'three';
export type SkateType = { trucks: string, deck: string }
export interface CountUpProps {
  count?: number;
  num?: number,
  numLiteral?: NumLiteral,
  str?: string,
  strLiteral?: StrLiteral,
  bool?: boolean,
  arr?: string[],
  obj?: SkateType,
}

export class CountUpComponent extends skate.Component<CountUpProps> {
  static get is() { return 'x-countup' }
  static get props(): skate.ComponentProps<CountUpComponent, CountUpProps> {
    return {
      count: skate.prop.number<CountUpComponent, number>({
        attribute: true,
        default(elem, data) {
          return 7;
        },
      }),
      num: skate.prop.number(),
      numLiteral: skate.prop.number<CountUpComponent, NumLiteral>(),
      str: skate.prop.string(),
      strLiteral: skate.prop.string<CountUpComponent, StrLiteral>(),
      bool: skate.prop.boolean(),
      arr: skate.prop.array<CountUpComponent, string>(),
      obj: skate.prop.object<CountUpComponent, SkateType>(),
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

customElements.define("x-app", class extends skate.Component<{}> {
  renderCallback() {
    return (
      <div>
        <h1>app</h1>
        <CountUpComponent count={100} obj={{ trucks: 'Independent', deck: 'ZERO' }}></CountUpComponent>
      </div>
    );
  }
});

export type ElmProps = { str: string; arr: any[]; };
class Elem extends skate.Component<ElmProps> {
  static get props(): skate.ComponentProps<Elem, ElmProps> {
    return {
      str: skate.prop.string(),
      arr: skate.prop.array()
    }
  }

  str: string;
  arr: string[];

  renderCallback() {
    return skate.h('div', 'testing');
  }
}


type ButtonProps = { onClick: (e: MouseEvent) => void };
const Button: skate.SFC<ButtonProps> = ({onClick}, children: any) => (
  <button onClick={onClick}>{children}</button>
);

type CounterOutputProps = { count: number };
const CounterOutput: skate.SFC<CounterOutputProps> = (props) => (
  <p>Count: <span>{props.count}</span></p>
);
