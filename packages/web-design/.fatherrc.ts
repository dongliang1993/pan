import pkg from './package.json';

export default {
  // more father 4 config: https://github.com/umijs/father-next/blob/master/docs/config.md
  esm: {
    output: 'es',
    transformer: 'babel',
    ignores: ['src/**/demo/*.{ts,tsx}'],
    extraBabelPresets: [
      [
        '@babel/preset-env',
        {
          modules: false, // 关闭模块转换
        },
      ],
    ],
    extraBabelPlugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          useESModules: true, // 使用 esm 形式的 helper
        },
      ],
    ],
  },
  cjs: {
    output: 'lib',
    transformer: 'babel',
    extraBabelPresets: ['@babel/preset-env'],
    extraBabelPlugins: ['@babel/plugin-transform-runtime'],
    ignores: ['src/**/demo/*.{ts,tsx}'],
  },
  umd: {
    name: pkg.name,
    output: 'dist',
  },
  extraBabelPresets: ['@babel/typescript', '@babel/react'],
  extraBabelPlugins: [
    '@babel/proposal-class-properties',
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
};
