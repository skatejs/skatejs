module.exports = function(bundler) {
  bundler.addAssetType('js', require.resolve('./asset-js'));
  bundler.addAssetType('ts', require.resolve('./asset-ts'));
};
