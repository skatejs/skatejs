define([
  'skate',
  'components/code',
  'components/external-link',
  'components/heading-link',
  'components/icon',
  'components/toc'
], function(
  skate,
  code,
  externalLink,
  headingLink,
  icon,
  toc
) {
  return function() {
    skate('pre[code]', code);
    skate('a.external', externalLink);
    skate('h1[id], h2[id], h3[id]', headingLink);
    skate('[icon]', icon);
    skate('.toc', toc);
    document.body.className = 'loaded';
  };
});
