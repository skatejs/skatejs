const fallbacks = {};

export function getGlobal(key) {
  const env = typeof window === "undefined" ? global : window;
  return key in env ? env[key] : fallbacks[key];
}

export function setGlobalFallback(key, fallback) {
  fallbacks[key] = fallback;
  return getGlobal(key);
}

export const customElements = setGlobalFallback("customElements", {
  define(name, ctor) {
    this[name] = ctor;
  },
  get(name) {
    return this[name];
  }
});
export const Event = setGlobalFallback("Event", class {});
export const HTMLElement = setGlobalFallback("HTMLElement", class {});
