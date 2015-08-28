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

function resolveParent (tag, html) {
  var container = document.createElement('div');
  var levels = 0;

  var parentTag = specialMap[tag];
  while (parentTag) {
    html = `<${parentTag}>${html}</${parentTag}>`;
    ++levels;
    parentTag = specialMap[parentTag];
  }

  container.innerHTML = html;

  var parent = container;
  for (let a = 0; a < levels; a++) {
    parent = parent.firstElementChild;
  }
  return parent;
}

function matchTag (html) {
  var tag = html.match(/\s*<([^\s>]+)/);
  return tag && tag[1];
}

export default function (html) {
  var tag = matchTag(html);
  return resolveParent(tag, html);
}
