'use strict';

import helpers from '../lib/helpers';
import MutationObserverPolyfill from '../../src/mutation-observer';

describe('MutationObserver polyfill', function () {

    it('should detect a mutation', function(done) {
      let fixture = helpers.fixture();

      fixture.setAttribute('checked','');

      let observer = new MutationObserverPolyfill((mutations) => {
        expect(mutations.length).to.equal(1);
        expect(mutations[0].type).to.equal('attributes');
        expect(mutations[0].oldValue).to.be.null;
        observer.disconnect();
        done();
      });

      observer.observe(fixture, {
        attributes: true
      });
      fixture.removeAttribute('checked');
    });
});
