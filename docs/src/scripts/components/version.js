import 'whatwg-fetch';
import skate from '../../../../src/index';

var fetch = window.fetch;

export default skate('gh-version', {
  properties: {
    repo: {
      attr: true,
      set (newValue) {
        fetch(`https://api.github.com/repos/${newValue}/tags`)
          .then(r => r.json())
          .then(r => this.textContent = r && r[0] && r[0].name || 'n/a');
      }
    }
  }
});
