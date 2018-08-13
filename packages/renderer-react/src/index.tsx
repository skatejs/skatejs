/* @jsx React.createElement */

import React from 'react';
import { render } from 'react-dom';
import { Root } from 'skatejs';

export default function(root: Root, func: () => Object) {
  render(func(), root);
}
