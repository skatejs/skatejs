const define = require('@skatejs/define').default;
const Element = require('@skatejs/element').default;

module.exports = define(class NotFound extends Element {
  static get props() {
    return {
      page: String
    };
  }
  render() {
    return `
      <div>
        <h1>Page not found</h1>
        <p>
          The page <strong>${this.page}</strong> could not be found.
        </p>
      </div>
    `;
  }
});
