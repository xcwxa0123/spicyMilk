const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const path = require('path');
const defaultConfig = getDefaultConfig(__dirname);
const config = {
    resolver: {
        alias: {
            '@assets': path.resolve(__dirname, 'src/assets'), // 关键配置
            "@components": path.resolve(__dirname, 'src/components'),
            "@pages": path.resolve(__dirname, 'src/pages'),
            "@tools": path.resolve(__dirname, 'src/tools'),
        },
    },
};
module.exports = mergeConfig(defaultConfig, config);
