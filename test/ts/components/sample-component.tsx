import {
  h,
  FunctionalComponent as SFC,
  ComponentProps as PreactComponentProps
} from 'preact';
import { props, withComponent, ComponentProps, WithComponent } from 'skatejs';

export const Component = withComponent();

export type NumLiteral = 123 | 124 | 125;
export type StrLiteral = 'one' | 'two' | 'three';
export type SkateType = { trucks: string; deck: string };
export type CountUpProps = {
  count?: number;
  num?: number;
  numLiteral?: NumLiteral;
  str?: string;
  strLiteral?: StrLiteral;
  bool?: boolean;
  arr?: string[];
  obj?: SkateType;
};

export class CountUpComponent extends Component<CountUpProps> {
  static is = 'x-countup';

  static props: ComponentProps<CountUpProps> = {
    count: {
      ...props.number,
      ...{
        attribute: true,
        default(elem: HTMLElement, data: Object) {
          return 7;
        }
      }
    },
    num: props.number,
    numLiteral: props.number,
    str: props.string,
    strLiteral: props.string,
    bool: props.boolean,
    arr: props.array,
    obj: props.object
  };

  count: number;

  click() {
    this.count += 1;
  }

  render() {
    return (
      <div>
        <CounterOutput count={this.count} />
        <Button onClick={e => this.click()}>Count up</Button>
      </div>
    );
  }
}
customElements.define(CountUpComponent.is, CountUpComponent);

type SkateParkProps = { year: number; halfPipe: boolean };
class SkatePark extends Component<SkateParkProps> {
  static is = 'my-skate-park';
  static props: skate.ComponentProps<SkateParkProps> = {
    year: props.number,
    halfPipe: props.boolean
  };
  render({ halfPipe, year }: SkateParkProps) {
    const halfPipeInfo = <span>{halfPipe ? 'has' : 'doesnt have'}</span>;
    return (
      <div>
        <p>
          Skate park exists since {year} and it {halfPipe} Half-Pipe
        </p>
      </div>
    );
  }
}
customElements.define(SkatePark.is, SkatePark);

customElements.define(
  'x-app',
  class extends Component {
    render() {
      return (
        <div>
          <h1>app</h1>
          {h('x-countup', {
            count: 100,
            obj: { trucks: 'Independent', deck: 'ZERO' }
          })}
        </div>
      );
    }
  }
);

export type ElemProps = { str: string; arr: any[] };
class Elem extends Component<ElemProps> {
  static props: ComponentProps<ElemProps> = {
    str: props.string,
    arr: props.array
  };

  str: string;
  arr: string[];

  render() {
    return h('div', {}, 'testing');
  }
}

type ButtonProps = PreactComponentProps<any> & {
  onClick: (e: MouseEvent) => void;
};
const Button = ({ onClick, children }: ButtonProps) => (
  <button onClick={onClick}>{children}</button>
);

type CounterOutputProps = PreactComponentProps<any> & { count: number };
const CounterOutput = (props: CounterOutputProps) => (
  <p>
    Count: <span>{props.count}</span>
  </p>
);
