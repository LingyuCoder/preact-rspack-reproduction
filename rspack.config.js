import { rspack } from '@rspack/core';
import PreactRefreshRspackPlugin from '@rspack/plugin-preact-refresh';

const getJsModule = (options) => {
  const { mode = 'production' } = options || {};
  const isDev = mode === 'development';
  return [
    {
      test: /\.(mjs|jsx?)$/,
      loader: 'builtin:swc-loader',
      options: {
        jsc: {
          experimental: {
            plugins: [
              [
                '@swc/plugin-prefresh', // enable prefresh specific transformation
                {}, // the customizable preact name, default is `["preact", "preact/compat", "react"]`
              ],
            ],
          },
          parser: {
            syntax: 'ecmascript',
            jsx: true,
          },
          transform: {
            react: {
              refresh: isDev,
              development: isDev,
              runtime: 'automatic',
            },
          },
        },
      },
      type: 'javascript/auto',
      exclude: [/node_modules\/@prefresh/, /node_modules\/preact/],
    },
    {
      test: /\.tsx?$/,
      loader: 'builtin:swc-loader',
      options: {
        jsc: {
          experimental: {
            plugins: [
              [
                '@swc/plugin-prefresh', // enable prefresh specific transformation
                {}, // the customizable preact name, default is `["preact", "preact/compat", "react"]`
              ],
            ],
          },
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              refresh: isDev,
              development: isDev,
              runtime: 'automatic',
            },
          },
        },
      },
      type: 'javascript/auto',
      exclude: [/node_modules\/@prefresh/, /node_modules\/preact/],
    },
  ];
};

/** @type {import('@rspack/cli').Configuration} */
export default {
  entry: {
    main: './src/main.tsx',
  },
  experiments: {
    css: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
  module: {
    // Docs: https://rspack.dev/guide/tech/preact#rspackplugin-preact-refresh
    rules: [
      ...getJsModule({
        mode: process.env.NODE_ENV
      }),
      {
        test: /\.(png|svg|jpg)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html',
      scriptLoading: 'blocking',
    }),
    new rspack.HotModuleReplacementPlugin(),
    new PreactRefreshRspackPlugin({}),
  ].filter(Boolean),
};
