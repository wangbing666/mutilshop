/**
 * Created by dell on 2017/11/2.
 */
var px2rem = require('postcss-px2rem');
module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: ['last 10 versions', 'ie>=8', '>1% in CN']
    }),
    px2rem({ remUnit: 75 })
  ]
}