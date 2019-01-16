import { Component, h } from '../utils';
import { Link } from './primitives';

const linkCss = ({ depth, selected }) => `
  a {
    background-color: ${selected ? '#DCE4CA' : 'transparent'};
    display: block;
    padding: 5px 10px 5px ${(depth ? depth * 10 : 0) + 10}px;
  }
  a:hover {
    background-color: #DCE4CA;
  }
`;

const navItems = () => [
  {
    href: '/',
    text: 'Home'
  },
  {
    href: '/guides',
    text: 'Guides',
    tree: [{ href: '/guides/storybook', text: 'Storybook' }]
  },
  {
    href: '/migrating',
    text: 'Migrating',
    tree: [{ href: '/migrating/old-to-new', text: 'Old to new' }]
  },
  {
    href: '/docs',
    text: 'Docs',
    tree: [
      { href: '/docs/define', text: 'define' },
      { href: '/docs/element', text: 'element' },
      { href: '/docs/element-lit-html', text: 'element-lit-html' },
      { href: '/docs/element-preact', text: 'element-preact' },
      { href: '/docs/element-react', text: 'element-react' },
      { href: '/docs/sk-context', text: 'sk-context' },
      { href: '/docs/sk-marked', text: 'sk-marked' },
      { href: '/docs/sk-router', text: 'sk-router' }
    ]
  }
];

function renderTree(items, depth = 0) {
  return items && items.length ? (
    <ul>
      {items.map(n => {
        return (
          <li>
            <Link
              css={linkCss({
                depth,
                selected: location.pathname === n.href
              })}
              href={n.href}
            >
              {n.text}
            </Link>
            {location.pathname.indexOf(n.href) === 0
              ? renderTree(n.tree, depth + 1)
              : ''}
          </li>
        );
      })}
    </ul>
  ) : (
    ''
  );
}

export class Layout extends Component {
  static props = {
    nav: Boolean,
    title: String
  };
  css = `
    .flex {
      display: flex;
      flex-wrap: wrap;
      margin: 0 auto;
      max-width: 1000px;
    }
    .flex-item {
      min-width: 0;
    }
    .nav {
      flex-basis: 200px;
      flex-shrink: 0;
      margin: 10px 20px 0 0;
    }
    .nav li {
      margin: 5px 0;
      padding: 0;
    }
    .nav ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .section {
      flex-basis: 300px;
      flex-grow: 1;
    }
  `;
  nav: boolean = true;
  title: string = '';
  connectedCallback() {
    super.connectedCallback();
    this.style.display = 'block';
  }
  render() {
    const { nav, title } = this;
    document.title = `SkateJS${title ? ` - ${title}` : ''}`;
    return (
      <div>
        {this.renderStyle()}
        <div class="flex">
          <div class="flex-item nav" />
          <section class="flex-item section">
            {title ? <h2>{title}</h2> : ''}
          </section>
        </div>
        <div class="flex">
          {nav ? <nav class="flex-item nav">{renderTree(navItems())}</nav> : ''}
          <section class="flex-item section">
            <slot />
          </section>
        </div>
      </div>
    );
  }
}
