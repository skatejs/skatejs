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
    skate('pre[code]').on('insert', code);
    skate('a.external').on('insert', externalLink);
    skate('h1[id], h2[id], h3[id]').on('insert', headingLink);
    skate('[icon]').on('insert', icon);
    skate('.toc').on('insert', toc);
  };
});
