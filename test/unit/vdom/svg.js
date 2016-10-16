/* eslint-env jasmine, mocha, chai */

import { define, vdom } from '../../../src';
import afterMutations from '../../lib/after-mutations';
import fixture from '../../lib/fixture';

const [svg] = vdom.builder('svg');

describe('vdom/svg', () => {
  it.only('#825 - should not error if window.SVGElement is undefined', done => {
    const oldSVGElement = window.SVGElement;
    window.SVGElement = undefined;
    const Elem = define('x-test', {
      render() {
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
