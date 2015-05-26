if (!window.__skate0) {
  window.__skate0 = {
    registerIfNotExists (name, value) {
      if (!this[name]) {
        this[name] = value;
      }

      return this[name];
    }
  };
}

export default window.__skate0;
