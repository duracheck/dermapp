const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  stream: require.resolve('stream-browserify'),
  crypto: require.resolve('crypto-browserify'),
  events: require.resolve('events'),
  http: require.resolve('stream-http'),
  https: require.resolve('https-browserify'),
  util: require.resolve('util'),
  url: require.resolve('url'),
  buffer: require.resolve('buffer/'),
  process: require.resolve('process/browser'),
};

module.exports = config;
