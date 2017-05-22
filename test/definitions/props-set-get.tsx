import * as skate from 'skatejs'
import { h, Component, props, define, PropOptions } from 'skatejs'

export type Props = {
  myArray: string[],
  myBoolean: boolean,
}

export class MyComponent extends Component<Props> {
  static get is() { return 'my-cmp' }
  static get props() {
    return {
      myArray: props.array,
      myBoolean: props.boolean
    }
  }
  myBoolean: boolean
  myArray: string[]
  private someNonPublicApiProp = 'Who are you?'

  renderCallback() {
    return <button onClick={_ => this._changeProps()}>Hello World</button>
  }

  private _changeProps() {
    this.props = { myBoolean: true }
    // or just directly
    this.myBoolean = true

    console.log(this.props) // { myArray: [], myBoolean: true }

    this.props = { myArray: ['hello'] }
    // or just directly
    this.myArray = ['hello']

    console.log(this.props) // { myArray: ['hello'], myBoolean: true }

    // this will not trigger re-render
    this.someNonPublicApiProp = 'Im David'
  }
}

export default define(MyComponent)
