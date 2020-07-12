const path = require("path");
const {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  title,
  abbreviation,
  devPort,
  providePlugin,
  build7z,
} = require("./src/config/settings");
const {
  version,
  author
} = require("./package.json");
const Webpack = require("webpack");
const WebpackBar = require("webpackbar");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const date = require("dayjs")().format("YYYY_M_D");
const time = require("dayjs")().format("YYYY-M-D HH:mm:ss");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = ["html", "js", "css", "svg"];
process.env.VUE_APP_TITLE = title || "qy-vue-admin";
process.env.VUE_APP_AUTHOR = author || "qy";
process.env.VUE_APP_UPDATE_TIME = time;
process.env.VUE_APP_VERSION = version;

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  devServer: {
    hot: true,
    port: devPort,
    open: true,
    noInfo: false,
    overlay: {
      warnings: true,
      errors: true,
    }
  },
  configureWebpack() {
    return {
      resolve: {
        alias: {
          "@": resolve("src"),
          "^": resolve("src/components"),
        },
      },
      plugins: [
        new Webpack.ProvidePlugin(providePlugin),
        new WebpackBar({
          name: `\u0071\u0079\u002d\u0076\u0075\u0065\u002d\u0061\u0064\u006d\u0069\u006e`,
        }),
      ],
    };
  },
  chainWebpack(config) {
    /* config.plugins.delete("preload");
    config.plugins.delete("prefetch"); */
    config.module
      .rule("svg")
      .exclude.add(resolve("src/remixIcon"))
      .add(resolve("src/colorfulIcon"))
      .end();
    config.module
      .rule("remixIcon")
      .test(/\.svg$/)
      .include.add(resolve("src/remixIcon"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "remix-icon-[name]"
      })
      .end();
    config.module
      .rule("colorfulIcon")
      .test(/\.svg$/)
      .include.add(resolve("src/colorfulIcon"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "colorful-icon-[name]"
      })
      .end();
    config.when(process.env.NODE_ENV === "development", (config) => {
      config.devtool("cheap-source-map");
    });
    config.when(process.env.NODE_ENV !== "development", (config) => {
      config.performance.set("hints", false);
      config.devtool("none");
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial",
          },
          elementUI: {
            name: "chunk-elementUI",
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
          },
          fortawesome: {
            name: "chunk-fortawesome",
            priority: 20,
            test: /[\\/]node_modules[\\/]_?@fortawesome(.*)/,
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"),
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      config
        .plugin("banner")
        .use(Webpack.BannerPlugin, [
          ` \u57fa\u4e8e\u0071\u0079\u002d\u0076\u0075\u0065\u002d\u0061\u0064\u006d\u0069\u006e\u6784\u5efa \n \u0063\u006f\u0070\u0079\u0072\u0069\u0067\u0068\u0074\u003a\u0020\u0071\u0079\u002d\u0076\u0075\u0065\u002d\u0061\u0064\u006d\u0069\u006e\u0020\u0031\u0037\u0037\u0038\u0034\u0038\u0036\u0032\u0035\u0032\u0040\u0071\u0071\u002e\u0063\u006f\u006d \n \u0074\u0069\u006d\u0065\u003a ${time}`,
        ])
        .end();
    });
    config
      .plugin("compression")
      .use(CompressionWebpackPlugin, [{
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
        threshold: 8192,
        minRatio: 0.8,
      }, ])
      .end();
    if (build7z) {
      config.when(process.env.NODE_ENV === "production", (config) => {
        config
          .plugin("fileManager")
          .use(FileManagerPlugin, [{
            onEnd: {
              delete: [`./${outputDir}/video`, `./${outputDir}/data`],
              archive: [{
                source: `./${outputDir}`,
                destination: `./${outputDir}/${abbreviation}_${outputDir}_${date}.7z`,
              }, ],
            },
          }, ])
          .end();
      });
    }
  },
  runtimeCompiler: true,
  productionSourceMap: true,
  css: {
    requireModuleExtension: true,
    sourceMap: true,
    loaderOptions: {
      scss: {
        prependData: '@import "~@/styles/variables.scss";',
      },
    },
  },
  devServer: {
    open: process.platform === 'darwin',
    host: 'localhost',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        target: "http://192.168.1.16",
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/api": ""
        }
      },
      '/foo': {
        target: '<other_url>'
      }
    },
    before: app => {}
  },
};