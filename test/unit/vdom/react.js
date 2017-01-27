/* eslint-env jasmine, mocha */
/** @jsx boreH */

import { Component, define, h } from '../../../src/index';
import React from 'react';
import { h as boreH, mount } from 'bore';

describe('vdom/react', () => {
  it('should accept react nodes as children', () => {
    const Elem = define(class extends Component {
      renderCallback () {
        return h('div', { skate: true },
          React.createElement('div', { react: true },
            React.createElement('span', { react: true }, 'text')
          )
        );
      }
    });
    return mount(<Elem />).wait()
      .then(w => expect(w.has('div > div > span')).to.equal(true) && w)
      .then(w => expect(w.one('span').node.textContent).to.equal('text'));
  });
});
