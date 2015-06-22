import 'whatwg-fetch';
import skate from '../../../../src/index';

var fetch = window.fetch;

export default skate('gh-stars', {
  properties: {
    repo: {
      attr: true,
      set (newValue) {
        fetch(`https://api.github.com/repos/${newValue}`)
          .catch(() => this.textContent = 'n/a')
          .then(r => r.json())
          .then(r => this.textContent = r && r.stargazers_count || 'n/a');
      }
    }
  }
});
