import css, { names, value } from 'yocss';
import { Component, h, style } from '../utils';
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
    href: '/components',
    text: 'Components',
    tree: [{ href: '/components/index', text: 'Components' }]
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

function renderTree(items, depth = 0) {
  return items && items.length ? (
    <ul>
      ${items.map(n => {
        const styles = linkCss({
          depth,
          selected: location.pathname === n.href
        });
        return (
          <li>
            <Link classNames={{ a: styles }} css={value(styles)} href={n.href}>
              ${n.text}
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

export class Layout extends Component {
  css = cssLayout;
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
        <div class={cssLayout.flex}>
          {this.$style}
          <div class={names(cssLayout.flexItem, cssLayout.nav)} />
          <section class={names(cssLayout.flexItem, cssLayout.section)}>
            {title ? <h2>{title}</h2> : ''}
          </section>
        </div>
        <div class={cssLayout.flex}>
          {nav ? (
            <nav class={names(cssLayout.flexItem, cssLayout.nav)}>
              {renderTree(navItems())}
            </nav>
          ) : (
            ''
          )}
          <section class={names(cssLayout.flexItem, cssLayout.section)}>
            <slot />
          </section>
        </div>
      </div>
    );
  }
}
