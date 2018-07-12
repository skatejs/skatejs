// @flow

export function defineContext(initialProps: any): Context {
  initialProps = { ...initialProps }

  class Context {

    constructor() {
      this._callbacks = new Map
      this._updatedProps = new Set

      this._propValues = {}

      for (let prop in initialProps) {
        this._propValues[prop] = initialProps[prop]
      }
    }

    observe(props, callback) {
      for (const prop of props) {
        let callbacksForProp = this._callbacks.get(prop)

        if (!callbacksForProp)
          this._callbacks.set(prop, callbacksForProp = new Set)

        callbacksForProp.add(callback)
      }
    }

    unobserve(callback) {
      for (const [prop, callbacksForProp] of this._callbacks) {
        if (callbacksForProp)
          callbacksForProp.delete(callback)
      }
    }

    _scheduleCallbacksForProp(prop) {
      this._updatedProps.add(prop)

      if (this._callbacksScheduled) return
      this._callbacksScheduled = true

      Promise.resolve().then(() => {
        this._callbacksScheduled = false
        this._runCallbacks()
      })
    }

    _runCallbacks() {
      const callbacksToCall = new Set

      for (const prop of this._updatedProps) {
        const callbacksForProp = this._callbacks.get(prop)

        if (callbacksForProp) {
          for (const callback of callbacksForProp) {
            callbacksToCall.add(callback)
          }
        }
      }

      this._updatedProps.clear()

      for (const callback of callbacksToCall) {
        callback()
      }
    }

  }

  for (let prop in initialProps) {
    Object.defineProperty(Context.prototype, prop, {
      get() { return this._propValues[prop] },
      set(value) {
        this._propValues[prop] = value
        this._updatedProps.add(prop)
        this._scheduleCallbacksForProp(prop)
      }
    })
  }

  return Context

}
