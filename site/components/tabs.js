import { Component, h, style, withRehydration } from '../utils';
import { define, props } from '../../src';

export const Tabs = define(
  class Tabs extends withRehydration(Component) {
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
    renderCallback({ items, onClick, state }) {
      const { selected } = state;
      return (
        <div>
          {style(
            this,
            `
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
          `
          )}
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
