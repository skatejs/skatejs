const browsers = {
  // iOS
  // ipad: {
  //   platform: 'OS X 10.11',
  //   version: '9.3',
  //   browserName: 'safari',
  //   deviceName: 'iPad 2',
  //   platformName: 'iOS',
  //   deviceOrientation: 'portrait',
  // },

  // Important: make sure mobile browsers are first,
  // to avoid viewport overflow isses after lots of
  // browsers are run.

  // Chrome
  chrome_canary_osx: {
    browserName: 'chrome',
    platform: 'OS X 10.11',
    version: 'dev'
  },
  chrome_latest_osx: {
    browserName: 'chrome',
    platform: 'OS X 10.11',
    version: 'latest'
  },
  chrome_latest_1: {
    browserName: 'chrome',
    platform: 'OS X 10.11',
    version: 'latest-1'
  },

  // Firefox
  firefox_latest_osx: {
    browserName: 'firefox',
    platform: 'OS X 10.11',
    version: 'latest'
  },
  firefox_latest_1: {
    browserName: 'firefox',
    platform: 'OS X 10.11',
    version: 'latest-1'
  },

  // Safari (<= 8 is severely crippled)
  safari_latest: {
    browserName: 'safari',
    platform: 'OS X 10.11',
    version: 'latest'
  },

  // IE
  internet_explorer_11: {
    browserName: 'internet explorer',
    platform: 'Windows 10',
    version: '11'
  },

  // Edge
  microsoftedge_latest: {
    browserName: 'microsoftedge',
    platform: 'Windows 10',
    version: 'latest'
  }
};

Object.keys(browsers).forEach(key => (browsers[key].base = 'SauceLabs'));
module.exports = browsers;
