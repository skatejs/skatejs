/* @jsx h */

import mount from '@skatejs/bore';
import { h } from '@skatejs/val';
import * as cases from 'jest-in-case';
import { Link } from '..';

cases(
  'render',
  dom => {
    return mount(dom).wait(w => {
      expect(w.node.shadowRoot.innerHTML).toMatchSnapshot();
    });
  },
  // @ts-ignore
  [<Link />, <Link href="/test" />, <Link css="a { color: #333; }" />]
);
