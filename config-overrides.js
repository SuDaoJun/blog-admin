const { override, fixBabelImports, addWebpackAlias, addDecoratorsLegacy, adjustStyleLoaders } = require('customize-cra');
const path = require('path')
const closedMap = config => {
  // 去掉打包生产map 文件
  // config.devtool = config.mode === 'development' ? 'cheap-module-source-map' : false;
  if(process.env.NODE_ENV==="production"){
    config.devtool=false;
  }
  return config
}; 

module.exports = override(
  // 配置指定文件为sass全局文件，可以不用导入就可以使用
  adjustStyleLoaders(rule => {
    if (rule.test.toString().includes('scss')) {
      rule.use.push({
        loader: require.resolve('sass-resources-loader'),
        options: {
          resources: [
            './src/assets/css/reset.scss',
            './src/assets/css/base.scss',
            './src/assets/css/common.scss'
          ]
        }
      });
    }
  }),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  addWebpackAlias({
    '@': path.resolve(__dirname, './src')
  }),
  addDecoratorsLegacy(),
  closedMap
);