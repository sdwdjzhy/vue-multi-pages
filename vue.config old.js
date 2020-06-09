const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const resolve = dir => {
    return path.join(__dirname, dir);
};
const isProduction = process.env.NODE_ENV === "production";

const BASE_URL = process.env.NODE_ENV === "development" ? "/" : "/";

const PAGE_ENTRIES = [{
        entry: "home",
        title: "首页",
    },
    {
        entry: "admin",
        title: "管理",
    }
];

module.exports = {
    publicPath: "/",
    outputDir: "/dist/",
    // 如果你不需要使用eslint，把lintOnSave设为false即可
    lintOnSave: true,

    //filenameHashing: isProduction ? false : true,
    chainWebpack: config => {
        config.resolve.alias
            .set("@", resolve("src")) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set("_c", resolve("src/components"));

        config.entryPoints.delete("app");
        config.plugins.delete("html");
        PAGE_ENTRIES.forEach(v => {
            config.entry(v.entry).add(`./src/entries/${v.entry}.js`);
            config.plugin(`html-${v.entry}`).use(HtmlWebpackPlugin, [{
                templateParameters: {
                    BASE_URL: "/",
                },
                title: v.title,
                // template: `./src/entries/${v}/index.html`,
                // entry: `./src/entries/${v}/main.js`,
                template: "./public/index.html",
                entry: `./src/entries/${v.entry}.js`,
                filename: `${v.entry}.html`,
                inject: true,
                excludeChunks: PAGE_ENTRIES.filter(item => item !== v),
            }]).before("preload");
        });
    },

    configureWebpack: config => {
        // if (isProduction) {
        //     config.externals = {
        //         vue: "Vue",
        //         lodash: "_",
        //         axios: "axios",
        //         "element-ui": "ELEMENT"
        //     };
        // }
    },

    // 打包时不生成.map文件
    productionSourceMap: false,

    // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
    devServer: {
        disableHostCheck: true,
        open: false,
        proxy: {
            "/apis/*": {
                target: "http://localhost:5000/", // 接口域名
                ws: true,
                pathRewrite: {
                    "^/apis": "/"
                },
                changeOrigin: true // 是否跨域
            }
        },
        overlay: {
            warnings: false,
            errors: true,
        },
        historyApiFallback: {
            rewrites: PAGE_ENTRIES.map(v => ({
                from: new RegExp(`^\\/${v}`),
                to: `/${v}.html`,
            })),
        },
    },
};