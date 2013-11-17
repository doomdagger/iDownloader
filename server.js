var http = require("http");
var Router = require("./lib/router");


var router = new Router();

http.createServer(function(req, res){
    router.assign(req, res);
}).listen(8080);

console.log("Server listened on port 8080...");

/*
var utils = require("./lib/utils")
    , fs = require("fs");

utils.gzipDir("D:\\Developer\\TDDOWNLOAD\\Design\\js素材\\test", fs.createWriteStream("D:\\Developer\\TDDOWNLOAD\\Design\\js素材\\test.tar.gz"));

*/