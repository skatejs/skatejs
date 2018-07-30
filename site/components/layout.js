import { html } from 'lit-html/lib/lit-extended';
import { define, props } from 'skatejs';
import css, { names, value } from 'yocss';

import { Component, style } from '../utils';
import { Link } from './primitives';

const linkCss = ({ depth, selected } = {}) =>
  css({
    backgroundColor: selected ? '#DCE4CA' : 'transparent',
    display: 'block',
    padding: `5px 10px 5px ${(depth ? depth * 10 : 0) + 10}px`,
    '&:hover': {
      backgroundColor: '#DCE4CA'
    }
  });

const navItems = () => [
  {
    href: '/',
    text: 'Home'
  },
  {
    href: '/guides',
    text: 'Guides',
    tree: [
      { href: '/guides/getting-started', text: 'Getting started' },
      { href: '/guides/flowtype', text: 'Flowtype' },
      { href: '/guides/storybook', text: 'Storybook' }
    ]
  },
  {
    href: '/migrating',
    text: 'Migrating'
  },
  {
    href: '/mixins',
    text: 'Mixins',
    tree: [
      { href: '/mixins/with-children', text: 'Children' },
      { href: '/mixins/with-component', text: 'Component' },
      { href: '/mixins/with-lifecycle', text: 'Lifecycle' },
      { href: '/mixins/with-renderer', text: 'Renderer' },
      { href: '/mixins/with-update', text: 'Update' }
    ]
  },
  {
    href: '/renderers',
    text: 'Renderers',
    tree: [
      { href: '/renderers/default', text: 'Default' },
      { href: '/renderers/with-lit-html', text: 'LitHTML' },
      { href: '/renderers/with-preact', text: 'Preact' },
      { href: '/renderers/with-react', text: 'React' }
    ]
  },
  {
    href: '/utils',
    text: 'Utilities',
    tree: [
      { href: '/utils/define', text: 'define()' },
      { href: '/utils/emit', text: 'emit()' },
      { href: '/utils/link', text: 'link()' },
      { href: '/utils/name', text: 'name()' },
      { href: '/utils/shadow', text: 'shadow()' }
    ]
  }
];

function renderTree(items: ?Array<Object>, depth = 0) {
  return items && items.length
    ? html`
        <ul>
          ${items.map(n => {
            const styles = linkCss({
              depth,
              selected: location.pathname === n.href
            });
            return html`
              <li>
                <x-link
                  classNames="${{ a: styles }}"
                  css="${value(styles)}"
                  href="${n.href}"
                >
                  ${n.text}
                </x-link>
                ${
                  location.pathname.indexOf(n.href) === 0
                    ? renderTree(n.tree, depth + 1)
                    : ''
                }
              </li>
            `;
          })}
        </ul>
      `
    : '';
}

const cssLayout = {
  flex: css({
    display: 'flex',
    flexWrap: 'wrap',
    margin: '0 auto',
    maxWidth: '1000px'
  }),
  flexItem: css({
    minWidth: 0
  }),
  nav: css({
    flexBasis: '200px',
    flexShrink: 0,
    margin: '10px 20px 0 0',
    ' li': {
      margin: '5px 0',
      padding: 0
    },
    ' ul': {
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }),
  section: css({
    flexBasis: '300px',
    flexGrow: 1
  })
};

@define
export class Layout extends Component {
  static is = 'x-layout';
  props: {
    nav: boolean,
    title: string
  };
  props = {
    nav: true
  };
  connecting() {
    this.style.display = 'block';
  }
  render({ nav, title }) {
    document.title = `SkateJS${title ? ` - ${title}` : ''}`;
    return this.$`
      ${this.$style}
      ${style(value(...Object.values(cssLayout)))}
      <div className="${cssLayout.flex}">
        <div className="${names(cssLayout.flexItem, cssLayout.nav)}"></div>
        <section className="${names(cssLayout.flexItem, cssLayout.section)}">
          ${title ? this.$`<h2>${title}</h2>` : ''}
        </section>
      </div>
      <div className="${cssLayout.flex}">
        ${
          nav
            ? this.$`
                <nav className="${names(cssLayout.flexItem, cssLayout.nav)}">
                  ${renderTree(navItems())}
                </nav>
              `
            : ''
        }
        <section className="${names(cssLayout.flexItem, cssLayout.section)}">
          <slot></slot>
        </section>
      </div>
    `;
  }
}
