module.exports = {
  // Chrome latest
  chrome_latest_linux: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Linux'
  },
  chrome_latest_windows: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 10'
  },
  chrome_latest_osx: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'OS X 10.11'
  },

  // Chrome 45
  chrome_45: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: '45'
  },

  // Firefox latest
  firefox_latest_linux: {
    base: 'SauceLabs',
    browserName: 'firefox'
  },
  firefox_latest_windows: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 10'
  },
  firefox_latest_osx: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'OS X 10.11'
  },

  // Firefox 40
  firefox_40: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: '40'
  },
  safari_latest_osx: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.11'
  },
  ie_9: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: '9',
    platform: 'Windows 7'
  },
  ie_10: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: '10',
    platform: 'Windows 7'
  },
  ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: '11',
    platform: 'Windows 8.1'
  }
};
