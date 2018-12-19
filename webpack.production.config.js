/**
 * Created by chenmao on 2017/6/28.
 */
var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var config=require('./config');
var px2rem = require('postcss-px2rem');
var theme = require('./package.json').theme;
module.exports = {
	devtool: false,
	entry: {
    	main: path.resolve(__dirname,'app/main.js'),
    	vendor: ['react','react-dom','react-router','react-router-dom','redux','react-redux','redux-thunk','redux-immutable','immutable','fastclick']
  	},
    externals: {
        'Config' : JSON.stringify({
            commonUrl: '/multiShop'
        })
    },
	output: {
		path: path.resolve(__dirname, 'multiShop'),
		publicPath: '/multiShop/',//   '/'    '/flagship/'     '/retail/'
		filename:'js/[name]-[hash:5].js',
		chunkFilename: 'js/[name].[chunkhash:5].chunk.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: "babel-loader?cacheDirectory"
			},
			{
				test:/\.less$/,
				use:ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: ["css-loader","postcss-loader","less-loader",{loader: 'less-loader', options: {modifyVars: theme}}]
				})
			},
			{
				test: /\.css$/,
				use:ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [{
						loader:"css-loader",
						options:{
							minimize: true //css压缩
						}
					},"postcss-loader"]
				})
			},
			{
				// 解析图片，小于8kb的转换成base64
				// 注意配种中的name,就是生成到了images文件夹下
				test: /\.(png|jpg)$/,
				exclude: /node_modules/,
				use: [{
					loader:'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
				}]
				//注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图
			},
			{
				test: /\.(eot|woff|ttf|woff2|gif|appcache|gif)(\?|$)/, // 解析各种非图片文件
				exclude: /node_modules/,
				use: ['file-loader?name=files/[name].[ext]']
			},
			{
				test: /\.json$/,
				use: "json-loader"
			},
			{
				test: /\.(svg)$/i,
				use: 'svg-sprite-loader',
				include: [
					require.resolve('antd-mobile').replace(/warn\.js$/, '')// 1. 属于 antd-mobile 内置 svg 文件
					//path.resolve(__dirname, 'app/images')// 2. 自己私人的 svg 存放目录
				]
			}
		]
	},
	resolve: {
		modules: ['node_modules', path.join(__dirname, '../node_modules')],
		extensions: [ '.web.js','.js', '.json','.less']
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": config.build.env
		}),
		new HtmlWebpackPlugin({
			template: __dirname + '/app/index.html'
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name:'common',
			filename:'js/common-[hash:5].js',
			minChunks: function (module, count) {
				// any required modules inside node_modules are extracted to vendor
				return (
					module.resource &&
					/\.js$/.test(module.resource) &&
					module.resource.indexOf(
						path.join(__dirname, 'node_modules')
					) === 0
				)
			}
		}),
		// new webpack.ProvidePlugin({
		// 	$:"jquery",
		// 	jQuery:"jquery",
		// 	"window.jQuery":"jquery"
		// }),//自动加载模块
		new webpack.optimize.UglifyJsPlugin({
		    beautify:false,//最紧密的压缩
		    comments:false,//移除注释
		    compress: {
		        warnings: false,
				drop_debugger: true,
				drop_console: true
		    },
		    except: [ '$', 'exports', 'require']//排除关键字
		}),
		new webpack.NoEmitOnErrorsPlugin(),
		new ExtractTextPlugin("styles/[name]-[hash:5].css")
	]
}
