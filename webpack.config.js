var webpack = require('webpack');

var plugins = [
	new webpack.DefinePlugin(
		{
			'process.env': {
				NODE_ENV: `"${process.env.NODE_ENV || 'development'}"`
			}
		}
	)
];

if (process.env.NODE_ENV === 'production') {
	plugins.push(
		new webpack.optimize.UglifyJsPlugin(
			{
				compress: {
					drop_console: true
				}
			}
		)
	);
}

var jsDirectory = `${__dirname}/docroot/js`;

module.exports = {
	context: `${jsDirectory}/src`,
	entry: {
		main: ['babel-polyfill', `${jsDirectory}/src/main.js`]
	},
	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['latest', 'metal-jsx', 'stage-2']
					}
				}
			}
		]
	},
	output: {
		filename: 'bundle.nocsf.js',
		library: 'RC',
		libraryTarget: 'var',
		path: `${jsDirectory}/dist`
	},
	plugins,
	resolve: {
		alias: {
			actions: `${jsDirectory}/src/actions`,
			components: `${jsDirectory}/src/components`,
			lib: `${jsDirectory}/src/lib`,
			middleware: `${jsDirectory}/src/middleware`,
			pages: `${jsDirectory}/src/pages`,
			reducers: `${jsDirectory}/src/reducers`,
			resources: `${jsDirectory}/src/resources`,
			store: `${jsDirectory}/src/store`,
			testData: `${jsDirectory}/src/test-data`
		},
		extensions: ['.js']
	}
};