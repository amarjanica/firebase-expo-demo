// Learn more https://docs.expo.io/guides/customizing-metro
const { mergeConfig } = require('metro-config');

const { getDefaultConfig } = require('expo/metro-config');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const ALIASES = {
  tslib: require.resolve('tslib/tslib.es6.js'),
};
/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  return context.resolveRequest(context, ALIASES[moduleName] ?? moduleName, platform);
};

module.exports = mergeConfig(getSentryExpoConfig(__dirname), config);
