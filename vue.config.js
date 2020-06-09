const path = require("path");

const resolve = dir => {
    return path.join(__dirname, dir);
};
const isProduction = process.env.NODE_ENV === "production";

const BASE_URL = process.env.NODE_ENV === "development" ? "/" : "/";

const PAGE_ENTRIES = [
    {
        entry: "home",
        title: "首页",
    },
    {
        entry: "admin",
        title: "管理",
    },
];

var pages = {};
PAGE_ENTRIES.forEach(i => {
    pages[i.entry] = {
        entry: `./src/entries/${i.entry}.js`,
        title: i.title,
        chunks: ["chunk-vendors", "chunk-common", i.entry],
    };
});

module.exports = {
    publicPath: BASE_URL,
    // 如果你不需要使用eslint，把lintOnSave设为false即可
    lintOnSave: true,
    pages,
    //filenameHashing: isProduction ? false : true,
    chainWebpack: config => {
        config.resolve.alias
            .set("@", resolve("src")) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set("_c", resolve("src/components"));

        // 使用 vue inspect --plugins > output.js 命令，查看所有的plugin，
        // 如果不要生成 某个html，例如和 home 的
        // config.plugins.delete("html-home");
    },

    configureWebpack: config => {
        if (isProduction) {
            config.externals = {
                vue: "Vue",
                "vue-i18n": "VueI18n",
                "vue-router": "VueRouter",
                "awe-dnd": "VueDragging",
                axios: "axios",
                clipboard: "ClipboardJS",
                iview: "iview",
                "js-cookie": "Cookies",
                jquery: "jQuery",
                lodash: "lodash",
                moment: "moment",
                sortablejs: "Sortable",
                "view-design": "iview",
            };
        }
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
                    "^/apis": "/",
                },
                changeOrigin: true, // 是否跨域
            },
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
