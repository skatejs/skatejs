// @flow

import css, { value } from 'yocss';
import { define, props } from 'skatejs';

import { Component, style } from '../utils';

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
export const Tabs = define(
  class extends Component {
    static is = 'x-tabs';
    props: {
      css: string,
      items: Array<Object>,
      selected: number
    };
    state = {
      selected: 0
    };
    connecting() {
      this.style.display = 'block';
    }
    onClick(i, e) {
      e.preventDefault();
      this.state = { selected: i };
    }
    render({ css, items, onClick, state }) {
      const { selected } = state;
      return this.$`
        ${this.$style}
        ${style(css, value(cssTabs))}
        <div className="${cssTabs}">
          <ul class="tabs">
            ${items.map(
              ({ name, pane }, i) =>
                pane
                  ? this.$`
                      <li class="tab">
                        <a
                          className="${i === selected ? 'selected' : ''}"
                          href="#"
                          on-click="${onClick.bind(this, i)}"
                        >
                          ${name}
                        </a>
                      </li>
                    `
                  : ''
            )}
          </ul>
          ${items.map(
            ({ pane }, i) =>
              pane
                ? this.$`
                    <div className="pane ${i === selected ? 'selected' : ''}">
                      ${pane}
                    </div>
                  `
                : ''
          )}
        </div>
      `;
    }
  }
);
