import * as types from '../types';

export default function (src, tar) {
  if (src.textContent === tar.textContent) {
    return [];
  }

  return [{
    target: tar,
    source: src,
    type: types.TEXT_CONTENT
  }];
}
