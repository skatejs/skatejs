// @flow

class Group extends Map {
  set(...itemsInGroup) {
  }
}

export function createContext(initialProps: any): Context {

  class Context {

    constructor() {
      this._callbacks = new Map
      this._updatedProps = new Set
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
      for (const prop of props) {
        const callbacksForProp = this._callbacks.get(prop)

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

  const propValues = {}

  const context = new Context

  for (let prop in initialProps) {
    propValues[prop] = initialProps[prop]

    Object.defineProperty(context, prop, {
      get: () => propValues[prop],
      set: value => {
        propValues[prop] = value
        this._updatedProps.add(prop)
        this._scheduleCallbacksForProp(prop)
      }
    })
  }

  return Object.freeze(context)

}
