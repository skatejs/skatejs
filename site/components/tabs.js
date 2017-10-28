import { define, props } from '../../src';
import { Component, h } from '../utils';

export const Tabs = define(
  class Tabs extends Component {
    static props = {
      items: props.array,
      selected: props.number
    };
    state = {
      selected: 0
    };
    onClick(i, e) {
      e.preventDefault();
      this.state = { selected: i };
    }
    render({ items, onClick, state }) {
      const { selected } = state;
      return (
        <div>
          <style>{`
            .pane {
              display: none;
            }
            .pane[selected] {
              display: block;
            }
            .tab {
              display: inline-block;
              margin: 0;
              padding: 0;
            }
            .tabs {
              border-bottom: 3px solid #ddd;
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
            .tabs a[selected],
            .tabs a:hover {
              border-bottom: 3px solid #F2567C;
              color: F2567C;
            }
          `}</style>
          <ul class="tabs">
            {items.map(({ name }, i) => (
              <li class="tab">
                <a
                  href="#"
                  onClick={onClick.bind(this, i)}
                  selected={i === selected ? '' : null}
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
          {items.map(({ pane }, i) => (
            <div class="pane" selected={i === selected ? '' : null}>
              {pane}
            </div>
          ))}
        </div>
      );
    }
  }
);
