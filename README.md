iDownloader
===========

基于node.js，提供类似WebDAV模式的高并发下载服务

架构
----
基于Hogan.js实现模板编译，基于node的原生http模块，文件的下载功能通过Stream对象实现。没有使用connet，没有使用express。额外支持文件夹的gzip打包下载，不仅仅是单文件下载。

界面
----
使用bootstrap美化界面，对于静态资源的加载，业务逻辑封装在了`./lib/static_root.js`中。

配置
----
可配置项有很多，包括想作为分享文件夹的路径（如果使用相对路径，那么是路径是基于`__dirname/lib/`的），模板文件路径，模板文件后缀名等等

> 配置文件位于`./lib/config.js', 请根据自己情况配置好共享路径，以便程序可以正常启动

启动
----
`cd`到项目目录，`node server.js`启动下载服务器，访问`localhost:8080`即可。

> 启动后，根据config.js中配置的共享路径，服务器将会列出共享文件夹的全部内容

![test](https://raw.githubusercontent.com/doomdagger/images/master/iDownloader/pic-1.jpg)

> 文件夹项的后面多出的下载按钮可以用来以压缩包形式下载整个文件夹内容

![test](https://raw.githubusercontent.com/doomdagger/images/master/iDownloader/pic-2.jpg)

> 也可以点击文件夹进入子文件夹，系统会列出当前所在路径信息

![test](https://raw.githubusercontent.com/doomdagger/images/master/iDownloader/pic-3.jpg)
