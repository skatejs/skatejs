import { Component, h } from '../utils';

export default class extends Component {
  static props = {
    path: String
  };
  path: string = '';
  render() {
    return (
      <div>
        <h2>Not found!</h2>
        <p>The page {this.path} could not be found.</p>
      </div>
    );
  }
}
