// @flow

class ContextGetter {

  constructor(el) {
    this.el = el
    this._cache = new Map
  }

  get(Context) {
    if (!this.el.constructor.consumes.find(ctx => ctx[0] === Context))
      throw new Error('Not subscribed to specified context')

    if (this._cache.has(Context)) return this._cache.get(Context)

    let node = this.el

    while ((node = node.parentNode || node.host)) {
      if (node.constructor.provides && node.constructor.provides.includes(Context)) {
        let context = node._providedContexts.get(Context)

        if (!context) {
          context = new Context
          node._providedContexts.set(Context, context)
        }

        this._cache.set(Context, context)

        return context
      }
    }

    throw new Error('Context not found')
  }

  clear() {
    this._cache.clear()
  }

}

export const withContext = (Base: Class<any> = HTMLElement): Class<any> => {
  return class extends Base {
    constructor(...args) {
      super(...args)

      if (this.constructor.provides) {
        this._providedContexts = new Map
        for (const Context of this.constructor.provides) {
          if (!this._providedContexts.has(Context))
            this._providedContexts.set(Context, new Context)
        }
      }
    }

    connectedCallback() {
      super.connectedCallback && super.connectedCallback()

      if (this.constructor.consumes) {
        this.contexts = new ContextGetter
        this._contextCallbacks = new Map

        for (const contextDescriptor of this.constructor.consumes) {
          const Context = contextDescriptor[0]
          const context = this.contexts.get(Context)
          const observedProps = contextDescriptor.slice(1)
          const callback = () => this.triggerUpdate()
          this._contextCallbacks.set(context, callback)
          context.observe(observedProps, callback)
        }
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback()

      if (this.constructor.consumes) {
        for (const [context, callback] of this._contextCallbacks)
          context.unobserve(callback)

        this._contextCallbacks = null
        this.contexts.clear()
      }
    }
  }
}
