## 4.0.0 to 5.0.0

- #928 - Removed `get()` and `set()` callbacks from `props` definitions. Use getters on the `prototype` instead of `get()` and use `updatedCallback()` or setters on the prototype instead of `set()`.
