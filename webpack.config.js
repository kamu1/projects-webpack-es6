var path = require('path');
var glob = require('glob');
var fs = require('fs');
var webpack = require('webpack');
// 引入css 单独打包插件
var ExtractTextPlugin = require("extract-text-webpack-plugin");
//打包HTML插件
var HtmlWebpackPlugin = require('html-webpack-plugin');
//提取公共模块
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
//打包压缩文件
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
//本地服务器
var BrowserSyncPlugin = require("browser-sync-webpack-plugin");
//打包环境
const debug = process.env.NODE_ENV !== 'production';

//console.log("NODE_ENV",process.env.NODE_ENV)

//打包生成文件的根目录
var bootPath = "dist/";
//代码源目录
var mainPath = 'src/';
//项目目录
var proPath = 'apps/reactES6/';
//图片等资源目录
var resPath = "/imgs/";
//网站ico图标位置
var icoPath = mainPath + 'apps/reactES6/inc/imgs/favicon.ico';
//获取入口文件列表
var entries = getEntry('./' + mainPath + proPath + '**/index.js', mainPath + proPath);
//提取公共文件
var chunks = Object.keys(entries);
//配制文件
var config = {
    entry: entries, //入口
    output: {       //输出位置
        // publicPath: "../",
        path: path.resolve(__dirname, bootPath),    //配置输出路径
        filename: '[name].js'                       //文件输出形式
    },
    resolve: {                                      // resolve 指定可以被 import 的文件后缀
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            { 
                test: /\.js[x]?$/, 
                loader: 'babel-loader?presets[]=es2015&presets[]=react', 
                exclude: /node_modules/
            },
            { 
                test: /\.(css|less)$/, 
                loader: ExtractTextPlugin.extract("style-loader", "!css-loader!less-loader"),
                exclude: /node_modules/
            },
            { 
                test: /\.scss$/, 
                loader: ExtractTextPlugin.extract("style-loader", "!css-loader!sass-loader"),
                exclude: /node_modules/
            }, {
                test: /\.html$/,
                loader: "html?attrs=img:src img:data-src",
                exclude: /node_modules/
            }, {
                test: /\.(png|jpe?g|gif)$/,
                loader: 'url-loader?limit=8192&name=' + resPath + '[hash:16].[ext]',
                exclude: /node_modules/
            }, {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name='+proPath+'resources/fonts/[name].[ext]',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        //读取打包环境是否为生产环境
        new webpack.DefinePlugin({
          'process.env':{
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            // 'NODE_ENV': JSON.stringify("production")
          }
        }),
        //开启静态服务器
        new BrowserSyncPlugin({
          host: 'localhost',
          port: 3000,
          browsers: [],
          server: { baseDir: [ './' ] }
        }),
        //加载jq
        new webpack.ProvidePlugin({
             // $: "jquery"
        }),
        // 将公共模块提取，生成名为vendors的chunk
        new CommonsChunkPlugin({
            name: 'vendors', 
            chunks: chunks,
            minChunks: chunks.length // 提取所有entry共同依赖的模块
        }),
        //自动将对应entry入口js文件中引入的CSS抽出成单独的文件，相对于output配置中的publickPath
        new ExtractTextPlugin('[name].css'),
        //生产环境下压缩代码
        debug ? function() {} : new UglifyJsPlugin({ //压缩代码
            compress: {
                warnings: false
            },
            except: ['$super', '$', 'exports', 'require'] //排除关键字
        })
    ]
}

//寻找目录下所有index.js和.html文件
var pages = Object.keys(getEntry('./'+ mainPath + proPath + '**/{index.js,*.html}', './'+mainPath + proPath));
//将html文件单独读取出来便于生成页面时做对比
var htmlPages = Object.keys(getEntry('./'+ mainPath + proPath + '**/*.html', './'+mainPath + proPath));
pages.forEach(function(pathname) {
    var conf = {
        filename: pathname + '.html', //生成的html存放路径，相对于path
        template: mainPath+'public/template/index.html', //html模板路径
        inject: false, //js插入的位置，true/'head'/'body'/false
        /*
         * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
         * 如在html标签属性上使用{{...}}表达式，很多情况下并不需要在此配置压缩项，
         * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
         * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
         */
        // minify: debug ? {} : { //压缩HTML文件
        //     removeComments: true, //移除HTML中的注释
        //     collapseWhitespace: true //删除空白符与换行符
        // }
    };

    //html当前路径模板若存在，则替换
    htmlPages.forEach(function(htmlpath){
        if (pathname == htmlpath){
           conf.template = mainPath + proPath + pathname + '.html';
        }
    });
    //若index.js对应存在，则改变插入引用的值
    if (pathname in config.entry) {
        conf.favicon = path.resolve(__dirname, icoPath);
        conf.inject = 'body';
        conf.chunks = ['vendors', pathname];
        conf.hash = false;
    }
    config.plugins.push(new HtmlWebpackPlugin(conf));
});

module.exports = config;

//读取指定的文件入口
function getEntry(globPath, pathDir) {
    var files = glob.sync(globPath);
    var entries = {},
        entry, dirname, basename, pathname, extname;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        pathname = path.normalize(path.join(dirname, basename));
        pathDir = path.normalize(pathDir);
        if (pathname.startsWith(pathDir)) {
            pathname = pathname.substring(pathDir.length);
        }
        entries[pathname] = ['./' + entry];
    }
    return entries;
}
