import css, { value } from 'yocss';
import { Component, h, style } from '../utils';

const cssTabs = css({
  pane: {
    display: 'none'
  },
  '.pane.selected': {
    display: 'block'
  },
  tab: {
    margin: 0,
    overflow: 'hidden',
    padding: 0
  },
  tabs: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0
  },
  '.tabs a': {
    borderBottom: '3px solid transparent',
    color: '#333',
    display: 'inline-block',
    padding: '15px 20px 18px 20px',
    position: 'relative',
    textDecoration: 'none',
    top: '3px'
  },
  '.tabs a.selected, .tabs a:hover': {
    borderBottom: '3px solid #F2567C',
    color: '#eee'
  }
});

export class Tabs extends Component {
  static props = {
    css: String,
    items: Array,
    state: Object
  };
  css: string = '';
  items: Array<{ name: string; pane: string }> = [];
  state = {
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
    const { css, items } = this;
    const { selected } = this.state;
    return (
      <div class={cssTabs}>
        {this.$style}
        {style(css, value(cssTabs))}
        <ul class="tabs">
          {items.map(
            ({ name, pane }, i) =>
              pane ? (
                <li class="tab">
                  <a
                    class={i === selected ? 'selected' : ''}
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
        {items.map(
          ({ pane }, i) =>
            pane ? (
              <div class={`pane ${i === selected ? 'selected' : ''}`}>
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
