import * as skate from 'skatejs'
import { h, Component, define } from 'skatejs'

export type Props = {}
export class MyComponent extends Component<Props> {
  static get is() { return 'my-cmp' }
  get renderRoot() {
    return this
  }
  renderCallback() {
    return (
      <div>
        <h1>Hello World</h1>
      </div>
    )
  }
}

export default define(MyComponent)
