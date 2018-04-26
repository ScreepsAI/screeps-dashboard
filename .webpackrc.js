import cssnano from 'cssnano';
import pxtorem from 'postcss-pxtorem';
import vendor from './src/vendor'

export default {
	entry              : {
		index : './src/index.js',
		vendor: vendor
	},
	publicPath         : '/',
	disableCSSModules  : false,
	hash               : true,
	ignoreMomentLocale : true,
	sass               : {
		includePaths: ['node_modules', 'src/style']
	},
	theme              : 'src/style/theme.js',
	html               : {
		'template': './src/index.ejs'
	},
	define             : {
		'$dirname': __dirname,
		'$isDev'  : process.env.NODE_ENV === 'development'
	},
	proxy              : {
		'/api': {
			target      : 'http://screeps.canisminor.cc',
			changeOrigin: true,
			xfwd        : true,
			secure      : true
		}
	},
	extraPostCSSPlugins: [
		pxtorem({
			        rootValue: 16,
			        propList: ['*'],
			        minPixelValue: 2,
		        })
	],
	extraBabelPlugins  : [
		'transform-decorators-legacy',
		'lodash',
		['import', {libraryName: 'antd', libraryDirectory: 'es', style: true}]
	],
	env                : {
		development: {
			extraBabelPlugins: [
				'dva-hmr', [
					'babel-plugin-styled-components', {
						'displayName': false
					}
				]
			]
		},
		production : {
			browserslist       : ['iOS >= 8', 'Android >= 4'],
			commons            : [
				{
					name     : 'vendor',
					filename : 'vendor.[chunkhash].js',
				}
			],
			extraPostCSSPlugins: [
				cssnano(
					{safe: true},
					{preset: ['default', {discardComments: {removeAll: true}}]})
			]
		}
	}
};

