var specialMap = {
  caption: 'table',
  dd: 'dl',
  dt: 'dl',
  li: 'ul',
  tbody: 'table',
  td: 'tr',
  thead: 'table',
  tr: 'tbody'
};

function matchTag (dom) {
  var tag = dom.match(/\s*<([^\s>]+)/);
  return tag && tag[1];
}

export default function (html) {
  return document.createElement(specialMap[matchTag(html)] || 'div');
}
