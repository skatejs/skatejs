/* eslint-env jasmine, mocha, chai */

import { Component, define, vdom } from '../../../src';
import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';

const [svg] = vdom.builder('svg');

// TODO unskip once the Shady CSS polyfill fixes this problem internally, or
// it's no longer needed.
describe.skip('vdom/svg', () => {
  it('#825 - should not error if window.SVGElement is undefined', done => {
    const oldSVGElement = window.SVGElement;
    window.SVGElement = undefined;
    const Elem = define(class extends Component {
      renderCallback () {
        return svg({ width: '100px' });
      }
    });
    fixture(new Elem());
    afterMutations(
      () => (window.SVGElement = oldSVGElement),
      done
    );
  });
});
