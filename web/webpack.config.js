const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const appDirectory = path.resolve(__dirname, '../');
const isProd = process.env.NODE_ENV === 'production';

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
        // Add every directory that needs to be compiled by Babel during the build
        // including third party modules like react-navigation etc.
        include: [
          path.resolve(appDirectory, 'index.js'),
          path.resolve(appDirectory, 'App.tsx'),
          path.resolve(appDirectory, 'src'),
          path.resolve(appDirectory, 'node_modules/react-native-web'),
          path.resolve(appDirectory, 'node_modules/react-navigation'),
          path.resolve(appDirectory, 'node_modules/@react-navigation/web'),
          path.resolve(appDirectory, 'node_modules/@react-navigation/native'),
          path.resolve(appDirectory, 'node_modules/react-navigation-stack'),
          path.resolve(appDirectory, 'node_modules/@react-navigation/native'),
          path.resolve(appDirectory, 'node_modules/react-native-gesture-handler'),
          path.resolve(appDirectory, 'node_modules/react-native-reanimated'),
          path.resolve(appDirectory, 'node_modules/react-native-gifted-chat'),
          path.resolve(appDirectory, 'node_modules/react-native-parsed-text'),
          path.resolve(appDirectory, 'node_modules/react-native-lightbox'),
          path.resolve(appDirectory, 'node_modules/react-native-paper'),
          path.resolve(appDirectory, 'node_modules/react-native-screens'),
          path.resolve(appDirectory, 'node_modules/react-native-svg'),
          path.resolve(appDirectory, 'node_modules/react-native-vector-icons'),
          path.resolve(appDirectory, 'node_modules/react-native-video'),
          path.resolve(appDirectory, 'node_modules/react-native-fast-image'),
          path.resolve(appDirectory, 'node_modules/react-native-animated-ellipsis'),
          path.resolve(appDirectory, 'node_modules/@react-native-community/netinfo'),
          path.resolve(appDirectory, 'node_modules/react-native-emoji-input'),
          path.resolve(appDirectory, 'node_modules/react-native-triangle'),
          path.resolve(appDirectory, 'node_modules/react-native-animatable'),
          path.resolve(appDirectory, 'node_modules/react-native-sound'),
        ],
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
