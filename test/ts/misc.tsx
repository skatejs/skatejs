const h = preact.h
import * as skate from 'skatejs'

const { withComponent, emit, link, define, props } = skate
type ComponentProps<E, T> = skate.ComponentProps<E, T>
type PreactComponentProps = preact.ComponentProps<any>
type SFC<P> = P & PreactComponentProps
const Component = withComponent()

{
  customElements.define(
    'x-hello',
    class extends Component<{ name: string }> {
      name: string
      static props = {
        name: { attribute: true },
      }
      renderCallback() {
        return h('div', {}, `Hello, ${this.name}`)
      }
    }
  )
}
{
  // https://github.com/skatejs/skatejs#counter
  customElements.define(
    'x-counter',
    class extends Component<{ count: number }> {
      static props: ComponentProps<any, { count: number }> = {
        // By declaring the property an attribute, we can now pass an initial value
        // for the count as part of the HTML.
        count: { ...skate.props.number, ...{ attribute: true } },
      }

      count: number
      intervalID?: NodeJS.Timer

      connectedCallback() {
        // Ensure we call the parent.
        super.connectedCallback()

        // We use a symbol so we don't pollute the element's namespace.
        this.intervalID = setInterval(() => ++this.count, 1000)
      }
      disconnectedCallback() {
        // Ensure we callback the parent.
        super.disconnectedCallback()

        // If we didn't clean up after ourselves, we'd continue to render
        // unnecessarily.
        if (this.intervalID) {
          clearInterval(this.intervalID)
        }
      }
      renderCallback() {
        return h('div', {}, `Count ${this.count}`)
      }
    }
  )
}
{
  // https://github.com/skatejs/skatejs#disconnectedcallback---supersedes-static-detached
  customElements.define(
    'my-component',
    class extends Component<any> {
      disconnectedCallback() {
        super.disconnectedCallback()
      }
    }
  )
}
{
  // https://github.com/skatejs/skatejs#attributechangedcallback---supersedes-static-attributechanged
  customElements.define(
    'my-component',
    class extends Component<any> {
      attributeChangedCallback(name: string, oldValue: any, newValue: any) {
        super.attributeChangedCallback(name, oldValue, newValue)
      }
    }
  )
}
{
  // https://github.com/skatejs/skatejs#static-observedattributes
  customElements.define(
    'my-component',
    class extends Component {
      static get observedAttributes() {
        // return super.observedAttributes.concat('my-attribute');
        return ((Component as any) as typeof Component).observedAttributes.concat('my-attribute')
      }
    }
  )
}
{
  class MyCmp extends Component {
    static props = {
      myProp: {
        attribute: {
          // set propert from my-prop attribute on element
          source: true,
          // reflect property value to different-prop on element
          target: 'differentProp',
        },
      },
    }
  }
}
{
  // https://github.com/skatejs/skatejs#coerce
  customElements.define(
    'my-component',
    class extends Component<{ myProp: any }> {
      static props = {
        myProp: {
          coerce(value: any) {
            return value
          },
        },
      }
    }
  )
}
{
  // https://github.com/skatejs/skatejs#default
  customElements.define(
    'my-component',
    class extends Component<{ myProp: any }> {
      static props = {
        myProp: {
          default: 'default value',
        },
      }
    }
  )

  customElements.define(
    'my-component',
    class B extends Component<{ myProp: any }> {
      static props = {
        myProp: {
          default(elem: B, data: string) {
            return []
          },
        },
      }
    }
  )
}
{
  // https://github.com/skatejs/skatejs#deserialize
  customElements.define(
    'my-component',
    class extends Component<{ myProp: any }> {
      static props = {
        myProp: {
          deserialize(value: string) {
            return value.split(',')
          },
        },
      }
    }
  )
}
{
  // https://github.com/skatejs/skatejs#serialize
  customElements.define(
    'my-component',
    class extends Component<{ myProp: any }> {
      static props = {
        myProp: {
          serialize(value: string[]) {
            return value.join(',')
          },
        },
      }
    }
  )
}
{
  // https://github.com/skatejs/skatejs#prototype
  customElements.define(
    'my-component',
    class extends Component {
      get someProperty() {
        return 1
      }
      set someProperty(v: number) {}
      someMethod() {}
    }
  )
}
{
  // https://github.com/skatejs/skatejs#updatedcallback---supersedes-static-updated
  customElements.define(
    'x-component',
    class extends Component {
      updatedCallback(previousProps: any) {
        // The previous props will not be defined if it is the initial render.
        if (!previousProps) {
          return true
        }

        // The previous props will always contain all of the keys.
        for (let name in previousProps) {
          if (previousProps[name] !== (this as any)[name]) {
            return true
          }
        }

        return false
      }
    }
  )

  type ElemProps = { str: string; arr: string[] }
  class Elem extends Component<ElemProps> {
    static props: ComponentProps<ElemProps, Elem> = {
      str: skate.props.string,
      arr: skate.props.array,
    }

    str: string
    arr: string[]

    renderCallback() {
      return h('div', {}, 'testing')
    }
  }

  customElements.define('x-element', Elem)

  const elem = new Elem()

  // Re-renders:
  elem.str = 'updated'

  // Will not re-render:
  elem.arr.push('something')

  // Will re-render:
  elem.arr = elem.arr.concat('something')

  function myCustomCheck(el: typeof Component, prev: any): boolean {
    return true
  }

  /*
  customElements.define('my-component', class extends Component<any> {
      updatedCallback(prev: any) {
          // You can reuse the original check if you want as part of your new check.
          // You could also call it directly if not extending: Component().
          return super.updated(prev) && myCustomCheck(this, prev);
      }
  });
   */

  customElements.define(
    'my-component',
    class extends Component {
      static props = {
        name: props.string,
      }

      name: string

      propsUpdatedCallback(next: any, prev: any) {
        if (next.name !== prev.name) {
          emit(this, 'name-changed', { detail: prev })
        }
      }
    }
  )
}
{
  // https://github.com/skatejs/skatejs#rendercallback---supersedes-static-render
  customElements.define(
    'my-component',
    class extends Component {
      renderCallback() {
        return h('p', {}, `My name is ${this.tagName}.`)
      }
    }
  )

  customElements.define(
    'my-component',
    class extends Component {
      renderCallback() {
        return <span>h('paragraph 1'), h('paragraph 2'),</span>
      }
    }
  )
}
{
  // https://github.com/skatejs/skatejs#renderedcallback---supersedes-static-rendered
  // NONE
}
{
  const Ctor1 = define(
    class extends HTMLElement {
      static is = 'x-test-1'
      private _who: string
      get who() {
        return this._who
      }
      set who(val) {
        this._who = val
      }
    }
  )

  const pureElemenInst = new Ctor1()
  console.log(pureElemenInst.who)

  const Ctor2 = define(
    class extends HTMLElement {
      static is = 'x-test-2'
    }
  )

  const SkateCtor = define(
    class extends Component<{ who: string }> {
      static is = 'my-skate'
      static props = {
        who: skate.props.string,
      }
      who: string
    }
  )

  const skElementInst = new SkateCtor()
  console.log(skElementInst.who)
}
{
  // https://github.com/skatejs/skatejs#emit-elem-eventname-eventoptions--
  customElements.define(
    'x-tabs',
    class extends Component {
      renderCallback() {
        return h('x-tab', { onSelect: () => {} })
      }
    }
  )

  customElements.define(
    'x-tab',
    class extends Component {
      renderCallback() {
        return h('a', { onClick: () => emit(this, 'select') })
      }
    }
  )
}
{
  // https://github.com/skatejs/skatejs#preventing-bubbling-or-canceling
  let elem = new Component()

  emit(elem, 'event', {
    composed: false,
    bubbles: false,
    cancelable: false,
  })

  // https://github.com/skatejs/skatejs#passing-data
  // let elem: typeof Component = null as any
  emit(elem, 'event', {
    detail: {
      data: 'my-data',
    },
  })
}
{
  // https://github.com/skatejs/skatejs#link-elem-propspec
  customElements.define(
    'my-input',
    class extends Component<{ value: any }> {
      static props = {
        value: { attribute: true },
      }
      renderCallback(): any {
        return h('input', { onChange: link(this, 'value'), type: 'text' })
      }
    }
  )

  customElements.define(
    'my-input',
    class extends Component<{ value: any }> {
      static props = {
        value: { attribute: true },
      }
      renderCallback(): any {
        const linkedInput = h('input', {
          name: 'someValue',
          onChange: link(this, 'value'),
          type: 'text',
        })

        const explicitlySetLinkedProp = link(this, 'someValue')

        const explicitlySetLinkedPropPath = link(this, 'obj.someValue')

        const explicitlySetLinkedInputPathWithCustomPropName = h('input', {
          name: 'someValue',
          onChange: link(this, 'obj.'),
          type: 'text',
        })
        const linkage = link(this, 'obj.')

        return [
          h('input', {
            name: 'someValue1',
            onChange: linkage,
            type: 'text',
          }),
          h('input', {
            name: 'someValue2',
            onChange: linkage,
            type: 'checkbox',
          }),
          h('input', {
            name: 'someValue3',
            onChange: linkage,
            type: 'radio',
          }),
          h(
            'select',
            { name: 'someValue4', onChange: linkage },
            h('option', { value: '2' }, 'Option 2'),
            h('option', { value: '1' }, 'Option 1')
          ),
        ]
      }
    }
  )
}

// #prop
// ====================================================================
{
  const customProp = {
    ...props.boolean,
    ...{
      coerce() {
        // coerce it differently than the default way
        return false
      },
    },
  }

  type UserModel = { id: number; email: string }
  class User extends Component<{ user: UserModel }> {
    static is = 'my-user'
    static props = {
      user: {
        ...skate.props.object,
        ...{
          default: { id: -1, email: '' },
        },
      },
    }

    renderCallback() {
      const { id, email } = this.props.user
      return (
        <p>
          <div>ID: {id}</div>
          <div>Email: {email}</div>
        </p>
      )
    }
  }

  class UserList extends Component<{ users: UserModel[] }> {
    static is = 'my-user-list'
    static props = {
      users: skate.props.array,
    }

    renderCallback() {
      const { users } = this.props
      return <ul>{users.map(user => <li>{h('my-user', { user })}</li>)}</ul>
    }
  }
}
{
  // https://github.com/skatejs/skatejs#other-ways-to-use-jsx
  customElements.define(
    'my-component',
    class extends Component<{ title: string }> {
      static props = {
        title: skate.props.string,
      }
      renderCallback() {
        return (
          <div>
            <h1>{this.props.title}</h1>
            {h('slot', { name: 'description' })}

            <article>{h('slot', {})}</article>
          </div>
        )
      }
    }
  )
}
{
  // https://github.com/skatejs/skatejs#component-constructor
  class MyElement extends Component {}
  customElements.define('my-element', MyElement)

  // Renders <my-element />
  h('my-element', {})

  // for https://github.com/Microsoft/TypeScript/issues/7004
  const anyProps = {}
  h('my-element', { ...anyProps })
}
{
  {
    customElements.define(
      'my-element',
      class extends Component {
        constructor() {
          super()
          this.addEventListener('change', this.handleChange)
        }

        handleChange(this: typeof Component, e: UIEvent) {
          // `this` is the element.
          // The event is passed as the only argument.
        }
      }
    )
  }

  // anchor test so this https://github.com/Microsoft/TypeScript/issues/13345 is mitigated
  {
    const Link = ({ to }: { to: string }) => <a href={to}>{h('slot', {})}</a>
    const LinkH = ({ to }: { to: string }) => h('a', { href: to }, h('slot', {}))
  }
  // slot projection attributes on Component references via JSX
  {
    type SFCSlotRef<E extends HTMLElement> = (
      props: {
        slot?: string
        ref?: ((instance: E) => any)
      }
    ) => any
    const Header: SFCSlotRef<HTMLSpanElement> = props => <span {...props}>Hello</span>
    const Body: SFCSlotRef<HTMLSpanElement> = props => <span {...props}>Hey yo body!</span>
    const Footer: SFCSlotRef<HTMLSpanElement> = props => <span {...props}>Footer baby</span>

    class Menu extends Component {
      static readonly is = 'my-menu'
      private menu = [{ link: 'home', name: 'Home' }, { link: 'about', name: 'About' }]
      renderCallback() {
        return (
          <ul>
            {this.menu.map(menuItem => (
              <li>
                <a href={menuItem.link}>{menuItem.name}</a>
              </li>
            ))}
          </ul>
        )
      }
    }
    class Page extends Component<void> {
      static readonly is = 'my-page'
      static readonly slots = {
        header: 'header',
        body: 'body',
        footer: 'footer',
        menu: 'menu',
      }
      renderCallback() {
        return (
          <main>
            <header>{h('slot', { name: Page.slots.header })}</header>
            <nav>{h('slot', { name: 'menu' })}</nav>
            <section>{h('slot', { name: Page.slots.body })}</section>
            <footer>{h('slot', { name: 'footer' })}</footer>
          </main>
        )
      }
    }

    class App extends Component {
      renderCallback() {
        return h(
          Page.is,
          {},
          h(Menu.is, {
            slot: Page.slots.menu,
            ref: _e => console.log(_e),
          }),
          /* projection and refs doesn't work by default, because you cant ref,slot a function. Instead you need to manually propagate props */
          <Header slot={Page.slots.header} />,
          <Body slot={Page.slots.body} />,
          <Footer slot="footer" ref={(_e: HTMLSpanElement) => console.log(_e)} />
        )
      }
    }
  }
}
