/**
 * Created by chenmao on 2017/6/30.
 */

var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"dev"'
});
