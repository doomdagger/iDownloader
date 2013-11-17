/**
 * Created by Lihe on 13-11-16.
 */

var fs = require('fs');
var mime = require('mime');
var config = require('./config');
var utils = require('./utils');

function StaticRoute(){
    this.static_dir = utils.normalize(config.static_dir);
    this.types = [];
    this._init_types();
}

StaticRoute.prototype._init_types = function(){
    var types = this.types;

    (function(dirName){
        function reiterate(dirName){
            var files = fs.readdirSync(dirName);
            files.forEach(function(fileName, index){
                var path = utils.resolvePath(dirName, fileName);
                var stat = fs.statSync(path);
                if(stat.isDirectory()){
                    reiterate(path);
                }else{
                    var ext = utils.extname(path).substring(1);
                    types[ext] = types[ext] || mime.types[ext];
                }
            });
        }
        reiterate(dirName);
    })(this.static_dir);


}

StaticRoute.prototype.matchRequest = function(req, res){
    var pathname = req._parsedUrl.pathname;
    var ext = utils.extname(pathname).substring(1);
    var path = utils.resolvePath(this.static_dir, pathname);

    if(!utils.exist(path)){
        return false;
    }

    var preferredType = req.headers.accept.split(/ *; */)[0].split(/ *, */)[0];
    if((preferredType==this.types[ext])||(ext=='js'&&preferredType=='*/*')||(preferredType.split(/ *\/ */)[0]==(this.types[ext]+"").split(/ *\/ */)[0])){
        var stat = fs.statSync(path);
        var content = fs.readFileSync(path);
        var code = 200;
        if(req.headers.lastModified==stat.mtime){
            code = 304;
        }
        res.writeHead(code, {
            "Content-Type":this.types[ext],
            "Connection" : "keep-alive",
            "Accept-Ranges" : "bytes",
            "Last-Modified" : stat.mtime.toString(),
            "Content-Length" : stat.size,
            "X-Powered-By" :"iDownloader"
        });

        res.end(content);
        return true;
    }else {
        return false;
    }
}

var staticRoute = new StaticRoute();

exports.staticRoute = staticRoute;