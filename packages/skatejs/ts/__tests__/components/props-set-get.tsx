import { h } from 'preact';
import {
  withComponent,
  props,
  define,
  PropOptions,
  WithComponent
} from '../..';

export const Component = withComponent();

export type Props = {
  myArray: string[];
  myBoolean: boolean;
};
export type State = Props;

export class MyComponent extends Component<Props, State> {
  static readonly is = 'my-cmp';
  static readonly props = {
    myArray: props.array,
    myBoolean: props.boolean
  };
  myBoolean: boolean;
  myArray: string[];
  private someNonPublicApiProp = 'Who are you?';

  render() {
    return <button onClick={_ => this._changeState()}>Hello World</button>;
  }

  private _changeState() {
    // as Props casting is needed as there is absolutely no way how to differently create
    // type definitions for setter and getter
    this.state = { myBoolean: true } as State;
    // or just directly
    this.myBoolean = true;

    console.log(this.props); // { myArray: [], myBoolean: true }

    this.state = { myArray: ['hello'] } as State;
    // or just directly
    this.myArray = ['hello'];

    console.log(this.props); // { myArray: ['hello'], myBoolean: true }

    // this will not trigger re-render
    this.someNonPublicApiProp = 'Im David';
  }
}

export default define(MyComponent);
