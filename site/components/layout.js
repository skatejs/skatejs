import css, { names, value } from 'yocss';
import { define, props } from 'skatejs';
import { Component, h } from '../utils';
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
      { href: '/utils/shadow', text: 'shadow()' }
    ]
  }
];

function renderTree(items: ?Array<Object>, depth = 0) {
  return items && items.length ? (
    <ul>
      {items.map(n => {
        const styles = linkCss({
          depth,
          selected: location.pathname === n.href
        });
        return (
          <li>
            <Link.is
              classNames={{ a: styles }}
              css={value(styles)}
              href={n.href}
            >
              {n.text}
            </Link.is>
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
    flexBasis: '150px',
    flexShrink: 0,
    margin: '104px 20px 0 0',
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
export const Layout = define(
  class Layout extends Component {
    props: {
      nav: boolean,
      title: string
    };
    props = {
      nav: true
    };
    connecting() {
      super.connecting();
      this.style.display = 'block';
    }
    render({ nav, title }) {
      return (
        <div class={cssLayout.flex}>
          <style>{`
            ${this.context.style}
            ${value(...Object.values(cssLayout))}
          `}</style>
          {nav ? (
            <nav class={names(cssLayout.flexItem, cssLayout.nav)}>
              {renderTree(navItems())}
            </nav>
          ) : (
            ''
          )}
          <section class={names(cssLayout.flexItem, cssLayout.section)}>
            {title ? <h2>{title}</h2> : ''}
            <slot />
          </section>
        </div>
      );
    }
  }
);
