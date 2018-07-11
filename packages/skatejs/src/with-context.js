// @flow

export const withContext = (Base: Class<any> = HTMLElement): Class<any> =>
  class extends Base {
    connectedCallback() {
      super.connectedCallback && super.connectedCallback()

      this._contextCallbacks = new Set

      for (const contextDescriptor in this.constructor.contexts) {
        const context = contextDescriptor[0]
        const observedProps = contextDescriptor.slice(1)
        const callback = () => this.triggerUpdate()
        this._contextCallbacks.add(callback)
        context.observe(observedProps, callback)
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback()

      for (const callback of this._contextCallbacks)
        context.unobserve(callback)

      this._contextCallbacks = null
    }
  }
