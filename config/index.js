'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

let basePath = '../dist/HW';
let publishPath = 'E:\\php\\dev-yii\\www\\hot_code\\youxuebao\\teacher\\www\\HW';

module.exports = {
  dev: {
    himUrl: 'http://teacher-master.yxban.anoah.com/lib/qti/',
    qtiUrl: 'http://teacher-master.yxban.anoah.com/lib/qti/',
    libUrl: 'http://teacher-master.yxban.anoah.com/lib/',
    version: new Date().toLocaleString(),
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8082, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
   * Source Maps
   */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    himUrl: '../lib/qti/',
    qtiUrl: '../lib/qti/',
    libUrl: '../lib/',
    version: new Date().toLocaleString(),
    // Template for index.html
    index: process.env.arg === 'publish' ? publishPath + '/index.html' : path.resolve(__dirname, basePath + '/index.html'),
    indexAndroid: process.env.arg === 'publish' ? publishPath + '/index-android.html' : path.resolve(__dirname, basePath + '/index-android.html'),
    indexAndroidAutoTest: process.env.arg === 'publish' ? publishPath + '/index-android-autotest.html' : path.resolve(__dirname, basePath + '/index-android-autotest.html'),
    indexIos: process.env.arg === 'publish' ? publishPath + '/index-ios.html' : path.resolve(__dirname, basePath + '/index-ios.html'),

    // Paths
    assetsRoot: process.env.arg === 'publish' ? publishPath : path.resolve(__dirname, basePath),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
