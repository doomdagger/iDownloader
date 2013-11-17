iDownloader
===========

基于node.js，提供类似WebDAV模式的高并发下载服务

##架构
基于Hogan.js实现模板编译，基于node的原生http模块，文件的下载功能通过Stream对象实现。没有使用connet，没有使用express。额外支持文件夹的gzip打包下载，不仅仅是单文件下载。

##界面
使用bootstrap美化界面，对于静态资源的加载，业务逻辑封装在了`./lib/static_root.js`中。

##配置
可配置项有很多，包括想作为分享文件夹的路径（如果使用相对路径，那么是路径是基于`__dirname/lib/`的），模板文件路径，模板文件后缀名等等

##启动
`cd`到项目目录，`node server.js`启动下载服务器，访问`localhost:8080`即可。
