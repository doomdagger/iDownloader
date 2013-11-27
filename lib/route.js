/**
 * Created by apple on 13-11-13.
 */
var fs = require("fs");
var util = require("util");
var config = require("./config");
var utils = require("./utils");
var Downloader = require("./downloader");
var EventEmitter = require('events').EventEmitter;
var render = require('./render').render;

var root_dir = utils.normalize(config.root_dir);

exports.root_dir = root_dir;

function Route(){
    this.path = "";
    this.filestat = null;
    this.config = {};
    this.options = {};
    this.busy = false;
    this.emitter = new EventEmitter();
    this.validQuery = [];
    var me = this;
    this.emitter.on("free", function(){
        me.busy = false;
        console.log('free啦~');
    });
}

Route.prototype._path = function(req){
    this.path = utils.resolvePath(root_dir, utils.decodeURI(req._parsedUrl.pathname));
};

Route.prototype._filestat = function(){
    var path = this.path || "";
    if(path&&utils.exist(path)){
        this.filestat = fs.statSync(path);
    }else{
        this.filestat = null;
    }
};

Route.prototype._calPosition = function(Range) {
    var startPos = 0, endPos = 0;
    if( typeof Range != 'undefined') {
        var startPosMatch = /^bytes=([0-9]+)-([0-9]+)?/.exec(Range);
        startPos = Number(startPosMatch[1]);
        endPos = Number(startPosMatch[2]);
    }
    return [startPos, endPos];
};

Route.prototype._options = function(req){
    if(!this.filestat) return;
    var position = this._calPosition(req.headers.range);
    this.options = {
        "flags" : 'r',
        "start" : position[0],
        "end" : position[1]||this.filestat.size
    };
};

Route.prototype._validQuery = function(req){
    this.validQuery = [];
    if(req._parsedUrl.query){
        this.validQuery = req._parsedUrl.query.split(/ *&* /).map(function(item){
            var param = item.split('=');
            return {
                "key" : param[0],
                "value" : param[1]
            }
        }).filter(function(item){
                for(var ix = 0; ix < config.valid_query_key.length; ++ix){
                    if(config.valid_query_key[ix] == item.key)
                        return true;
                }
                return false;
            });
    }
};

Route.prototype._analyse_req = function(req){
    //确定path
    this._path(req);
    //确定filestat
    this._filestat();
    //确定downloader的options
    this._options(req);

    this._validQuery(req);
};

Route.prototype._flush_res = function(res, code, content){
    var optionParam;

    if((code+"")[0]!=2){
        res.setHeader("Content-Type", "text/html;charset=utf8");
        if(code==404){
            content = render.render("404", {"msg":"hello, my render page!"});
        }else {
            content = config.internal_error_content;
        }
    }else{
        if(this.filestat.isDirectory()){
            for(var ix = 0; ix < this.validQuery.length; ++ix){
                if(this.validQuery[ix].key == 'option'){
                    optionParam = this.validQuery[ix].value;
                }
            }
            if(optionParam == 'gzip'){
                res.setHeader("Content-Type", 'application/octet-stream;charset=utf8');
                res.setHeader("Content-Disposition", "attachment;filename*=UTF-8''"+utils.encode(utils.basename(this.path)+".tar.gz"));
            }else{
                res.setHeader("Content-Type", "text/html;charset=utf8");
            }
        }else{
            res.setHeader("Content-Type", 'application/octet-stream;charset=utf8');
            if(this.options.start)
                res.setHeader('Content-Range', 'bytes ' + this.options.start + '-' + (this.options.end - 1) + '/' + this.options.end);
            else
                res.setHeader('Accept-Range', 'bytes');
            res.setHeader("Content-Length", this.options.end);
            res.setHeader("Content-Disposition", "attachment;filename*=UTF-8''"+utils.encode(utils.basename(this.path)));
        }
    }
    //console.log(util.inspect(res._headers));
    res.writeHead(code);
    if(code!=206){
        if(optionParam){
            utils.gzipDir(this.path, res, this.emitter);
        }else{
            res.end(content);
            this.busy = false;
        }
    }else{
        var downloader = new Downloader(this.path, this.options);
        downloader.download(res, this.emitter);
    }
};

Route.prototype.handle = function(req, res){
    var me = this;
    me.busy = true;

    this._analyse_req(req);

    var code;
    var content = "";
    var path = this.path;

    if(!this.filestat)
        code = 404;
    else{
        if(this.filestat.isDirectory()){
            var files = fs.readdirSync(path);
            code = 200;
            files = files.map(function(fileName){
                var filePath = utils.resolvePath(path, fileName);
                //console.log(filePath);
                var stat = fs.statSync(filePath);
                return {
                    "name" : fileName,
                    "path" : "/"+utils.normalizeSlashes(utils.relativePath(root_dir, filePath)),
                    "size" : utils.parseBytes(stat.size),
                    "lastModified" : stat.mtime.toLocaleDateString(),
                    "isFile" : stat.isFile(),
                    "isDir" : stat.isDirectory()
                };
            });
            content = render.render('dir', {
                "files" : files,
                "directory" : utils.decodeURI(req._parsedUrl.pathname)
            });
        }else{
            code = 206;
        }
    }

    this._flush_res(res, code, content);
};


module.exports = Route;

