const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const chalk = require('chalk')

const appDirectory = path.resolve(__dirname, '../');
const isProd = process.env.NODE_ENV === 'production';

// Compiles modules which has following keys in their path.
const modules = [
  'src',
  'react-native',
  'react-navigation',
  'expo',
  'unimodules',
  '@react',
  '@expo',
  '@unimodules',
  'native-base',
]

function packageNameFromPath(inputPath) {
  const modules = inputPath.split('node_modules/');
  const libAndFile = modules.pop();
  if (!libAndFile) return null;
  if (libAndFile.charAt(0) === '@') {
    const [org, lib] = libAndFile.split('/');
    return org + '/' + lib;
  } else {
    const components = libAndFile.split('/');
    const first = components.shift();
    return first || null;
  }
}

const compiledPackageNames = [];
function logPackage(packageName) {
  if (!compiledPackageNames.includes(packageName)) {
    compiledPackageNames.push(packageName);
    console.log(chalk.cyan('\nCompiling module: ' + chalk.bold(packageName)));
  }
}

const config = {
  entry: [path.resolve(appDirectory, 'index.js')],

  output: {
    filename: isProd ? '[name].[contenthash:8].js' : '[name].js',
    path: path.resolve(__dirname, 'build'),
  },

  module: {
    rules: [
      {
        test: /\.(tsx|ts|js)$/,
        include: function(inputPath) {
          for (const possibleModule of modules) {
            if (inputPath.includes(possibleModule)) {
              const packageName = packageNameFromPath(inputPath);
              if (packageName) logPackage(packageName);
              return !!inputPath;
            }
          }
          return false;
        },
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['module:metro-react-native-babel-preset'],
            plugins: ['react-native-web'],
          },
        },
      },
      {
        test: /\.(gif|jpe?g|png|ttf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: isProd ? '[name].[contenthash:8].[ext]' : '[name].[ext]',
            outputPath: 'assets',
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEV__: !isProd,
    }),

    new webpack.HashedModuleIdsPlugin(),

    new HtmlPlugin({
      template: 'web/index.html',
      minify: true,
      showErrors: false,
    }),

    new CopyPlugin([
      {
        from: path.resolve(__dirname + '/index.css'),
        to: '.',
      },
    ]),
  ],

  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      '@react-native-community/netinfo': 'react-native-web/dist/exports/NetInfo',
      'react-native-fast-image': 'react-native-web/dist/exports/Image',
    },
    extensions: ['.web.js', '.js', '.web.ts', '.web.tsx', '.ts', '.tsx', '.json'],
  },
};

if (isProd) {
  config.optimization = {
    minimizer: [new TerserPlugin()],
  };
} else {
  config.devServer = {
    port: 8080,
    open: true,
    hot: true,
    compress: true,
    stats: 'errors-only',
    overlay: true,
  };
}

module.exports = config;