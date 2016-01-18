import type from './type/element';

const noop = function () {};

export default {
  attached: noop,
  attribute: noop,
  created: noop,
  render: noop,
  detached: noop,
  events: {},
  extends: '',
  properties: {},
  prototype: {},
  resolvedAttribute: 'resolved',
  ready: noop,
  type,
  unresolvedAttribute: 'unresolved'
};
