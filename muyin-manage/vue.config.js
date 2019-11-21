module.exports = {
    // baseUrl: './',
    baseUrl: process.env.NODE_ENV === "production" ? "/" : "./",
    // assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: 'http://120.79.56.120:8080' //'http://172.16.1.101:8083/',//  // 'http://47.102.150.252', //
    },
    css: {
        loaderOptions: {
            sass: {
                prependData: `
                    @import "~@/assets/sass/_var.scss";
                `
            }
        }
    },
    // devServer: {
    //     proxy: {
    //         '/api':{
    //             target:'http://jsonplaceholder.typicode.com',
    //             changeOrigin:true,
    //             pathRewrite:{
    //                 '/api':''
    //             }
    //         }
    //     }
    // }
}