# projects-webpack-es6
以webpack为基础来打包构建的前端项目(reactJS + react-router + ES6)
#### react SPA Demo
	reactJS + react-router + ES6
> 
1. git clone https://github.com/kamu1/projects-webpack-es6.git
1. cd projects-webpack-es6
1. npm install
1. webpack --watch
1. http://localhost:3000/dist

#### webpack.config.js
> 
+ 实现多项目打包；
+ 解决了多入口引用；
+ 引用公共文件会自动合并；
+ 实现了静态页面按入口文件自动生成；
+ 对应的JS模块和页面级CSS自动生成标签插入到页面指定位置；
+ 同时支持sass、less、css文件处理，你会什么就可以用什么；
+ 启用了开发环境及生产环境的代码压缩机制。

#####备注
	1、项目是默认以所有 index.js 为入口文件的，可自行设置；
	2、静态页面会生成与入口文件一致的名称；
	3、模板文件可在入口所在目录自行新建index.html，否则会读取public/目录下的模板文件。
	4、更多内容还会逐渐优化，敬请期待...



	
