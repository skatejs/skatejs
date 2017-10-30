// @flow

import { define, props } from '../../src';
import { Component, h } from '../utils';
import { Link } from './primitives';

const bgColor = '#DCE4CA';
const linkCss = ({ depth, selected } = {}) => `
  a {
    ${selected ? `background-color: ${bgColor};` : ''}
    display: block;
    padding: 5px 10px 5px ${(depth ? depth * 10 : 0) + 10}px;
  }
  a:hover {
    background-color: ${bgColor};
  }
`;

const navItems = () => [
  {
    href: '/',
    text: 'Home'
  },
  {
    href: '/mixins',
    text: 'Mixins',
    tree: [
      { href: '/mixins/with-children', text: 'Children' },
      { href: '/mixins/with-component', text: 'Component' },
      { href: '/mixins/with-context', text: 'Context' },
      { href: '/mixins/with-lifecycle', text: 'Lifecycle' },
      { href: '/mixins/with-renderer', text: 'Renderer' },
      { href: '/mixins/with-update', text: 'Update' },
      { href: '/mixins/with-unique', text: 'Unique' }
    ]
  },
  {
    href: '/renderers',
    text: 'Renderers'
  },
  {
    href: '/utilities',
    text: 'Utilities'
  }
];

function renderTree(items: ?Array<Object>, depth = 0) {
  return items && items.length ? (
    <ul>
      {items.map(n => (
        <li>
          <Link.is
            css={linkCss({
              depth,
              selected: location.pathname === n.href
            })}
            href={n.href}
          >
            {n.text}
          </Link.is>
          {location.pathname.indexOf(n.href) === 0
            ? renderTree(n.tree, depth + 1)
            : ''}
        </li>
      ))}
    </ul>
  ) : (
    ''
  );
}

export const Layout = define(
  class Layout extends Component {
    props: {
      nav: boolean,
      title: string
    };
    props = {
      nav: true
    };
    render({ nav, title }) {
      return (
        <div class="flex">
          <style>{`
            ${this.context.style}
            :host {
              display: block;
            }
            .flex {
              display: flex;
              flex-wrap: wrap;
              margin: 0 auto;
              max-width: 800px;
            }
            .flex-item {
              min-width: 0;
            }
            ul {
              list-style: none;
              margin: 0;
              padding: 0;
            }
            li {
              margin: 5px 0;
              padding: 0;
            }
            nav {
              flex-shrink: 0;
              margin: 104px 20px 0 0;
            }
            section {
              flex-basis: 300px;
              flex-grow: 1;
            }
          `}</style>
          {nav ? <nav class="flex-item">{renderTree(navItems())}</nav> : ''}
          <section class="flex-item">
            {title ? <h2>{title}</h2> : ''}
            <slot />
          </section>
        </div>
      );
    }
  }
);
