/* global module */

const baseConfig = {
  presets: [
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: ['@babel/plugin-syntax-dynamic-import', 'babel-plugin-graphql-tag'],
};

const browserConfig = {
  ...baseConfig,
  presets: [['@babel/preset-env', { modules: false }], ...baseConfig.presets],
};

const testConfig = {
  ...baseConfig,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '12',
        },
      },
    ],
    ...baseConfig.presets,
  ],
};

module.exports = {
  ...browserConfig,
  env: {
    test: {
      ...testConfig,
    },
  },
};
