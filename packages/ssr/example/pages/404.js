const { define, props, withComponent } = require('skatejs');

module.exports = define(
  class NotFound extends withComponent() {
    static props = {
      page: props.string
    };
    render({ page }) {
      return `
        <div>
          <h1>Page not found</h1>
          <p>
            The page <strong>${page}</strong> could not be found.
          </p>
        </div>
      `;
    }
  }
);
