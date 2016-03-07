import helperElement from '../lib/element';
import helperFixture from '../lib/fixture';
import helperReady from '../lib/ready';

import skateMaster from '../../src/index';
// FIXME Babel seems to wreck this one - skate is exposed, not skate014
import {skate as skate014} from '../skate/0.14.3.js'; // eslint-disable-line no-unused-vars
const oldSkate = skate; // eslint-disable-line no-undef

describe('multiple-versions', function () {
  it('is possible to have multiple versions of skate on the page', function (done) {
    var called = [];

    function skateAndCreate(customSkate) {
      const el = helperElement();
      customSkate(el.safe, {
        created () {
          called.push(customSkate.version);
        }
      });
      helperFixture(document.createElement(el.safe));
    }

    skateAndCreate(skateMaster);
    skateAndCreate(oldSkate);

    helperReady(function () {
      expect(called.sort()).to.deep.equal([skateMaster.version, oldSkate.version].sort());
      done();
    });
  });

});
