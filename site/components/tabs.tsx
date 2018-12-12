import css from 'shadow-css';
import { Component, h } from '../utils';

const style = css(`
  .pane {
    display: none;
  }
  .pane.selected {
    display: block;
  }
  .tab {
    margin: 0;
    overflow: hidden;
    padding: 0;
  }
  .tabs {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .tabs a {
    border-bottom: 3px solid transparent;
    color: #333;
    display: inline-block;
    padding: 15px 20px 18px 20px;
    position: relative;
    text-decoration: none;
    top: 3px;
  }
  .tabs a.selected, .tabs a:hover {
    border-bottom: 3px solid #F2567C;
    color: #eee;
  }
`);

export class Tabs extends Component {
  static props = {
    css: String,
    items: Array,
    state: Object
  };

  css?: string = '';
  items?: Array<{ name: string; pane: any }> = [];
  state?: { selected: number } = {
    selected: 0
  };

  connectedCallback() {
    super.connectedCallback();
    this.style.display = 'block';
  }

  onClick(i: number, e: Event) {
    e.preventDefault();
    this.state = { selected: i };
  }

  render() {
    return (
      <div>
        {this.renderStyle(style)}
        <ul class="tabs">
          {this.items.map(({ name, pane }, i) =>
            pane ? (
              <li class="tab">
                <a
                  class={i === this.state.selected ? 'selected' : ''}
                  href="#"
                  onClick={this.onClick.bind(this, i)}
                >
                  {name}
                </a>
              </li>
            ) : (
              ''
            )
          )}
        </ul>
        {this.items.map(({ pane }, i) =>
          pane ? (
            <div class={`pane ${i === this.state.selected ? 'selected' : ''}`}>
              {pane}
            </div>
          ) : (
            ''
          )
        )}
      </div>
    );
  }
}
