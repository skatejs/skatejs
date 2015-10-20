'use strict';

import helpers from '../lib/helpers';
import '../../src/mutation-observer';

describe('MutationObserver polyfill', function () {

    it('should detect a mutation', function(done) {
      let fixture = helpers.fixture();
      fixture.setAttribute('checked','');

      helpers.afterMutations(function() {
        let observer = new window.MutationObserver((mutations) => {
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


    it('should use old values when removing', function(done) {
      let fixture = helpers.fixture();
      fixture.setAttribute('checked','');

      helpers.afterMutations(function() {
        let observer = new window.MutationObserver((mutations) => {
          expect(mutations.length).to.equal(1);
          expect(mutations[0].type).to.equal('attributes');
          expect(mutations[0].oldValue).to.equal('');
          expect(typeof mutations[0].newValue).to.equal('undefined');
          observer.disconnect();
          done();
        });

        observer.observe(fixture, {
          attributes: true,
          attributeOldValue: true
        });

        fixture.removeAttribute('checked');
      });
    });

    it('should use old values when adding', function(done) {
      let fixture = helpers.fixture();
      let attributeName = 'foo';
      helpers.afterMutations(function() {
        let observer = new window.MutationObserver((mutations) => {
          expect(mutations.length).to.equal(1);
          expect(mutations[0].attributeName).to.equal(attributeName);
          expect(mutations[0].type).to.equal('attributes');
          expect(mutations[0].oldValue).to.equal(null);
          expect(typeof mutations[0].newValue).to.equal('undefined');
          observer.disconnect();
          done();
        });

        observer.observe(fixture, {
          attributes: true,
          attributeOldValue: true
        });
      });
      helpers.afterMutations(function() {
        fixture.setAttribute(attributeName,'bla');
      });
    });
});
