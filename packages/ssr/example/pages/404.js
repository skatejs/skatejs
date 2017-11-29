/** @jsx h */

const { Component, define, h, props } = require('skatejs');

module.exports = define(
  class NotFound extends Component {
    static props = {
      page: props.string
    };
    renderCallback({ page }) {
      return (
        <div>
          <h1>Page not found</h1>
          <p>
            The page <strong>{page}</strong> could not be found.
          </p>
        </div>
      );
    }
  }
);
