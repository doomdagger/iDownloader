/**
 * Created by apple on 13-11-13.
 */

var path = require("path");
var fs = require("fs");
var bytes = require('bytes');
var parse = require('url').parse;
var tar = require("tar");
var fstream = require("fstream");


var toString = {}.toString();

exports.isAbsolute = function(path){
    if('/'==path[0]) return true;
    if(":"==path[1]&&"\\"==path[2]) return true;
    return "\\\\" == path.substring(0, 2);

};

exports.normalize = function(aPath){
    if(!exports.isAbsolute(aPath)){
        aPath = path.join(__dirname,aPath);
    }
    if(aPath[aPath.length-1]==path.sep)
        aPath = aPath.substring(0, aPath.length-1);
    return path.normalize(aPath);
};

exports.resolvePath = function(root, aPath){
    return path.join(root, aPath);
};

exports.exist = function(path){
    return fs.existsSync(path)
};

exports.basename = function(aPath){
    return path.basename(aPath);
};

exports.extname = function(aPath){
   return path.extname(aPath);
};

exports.relativePath = function(patha, pathb){
    return path.relative(patha, pathb);
};

exports.encode = function(url){
    return encodeURIComponent(url);
};

exports.decodeURI = function(path){
    //console.log(path);
    return decodeURI(path);
};

exports.normalizeSlashes = function normalizeSlashes(aPath) {
    return aPath.split(path.sep).join('/');
};

exports.parseBytes = function(size){
    return (size)?bytes(size).toUpperCase() : "--";
};

exports.parseUrl = function(req){
    var parsed = req._parsedUrl;
    if (parsed && parsed.href == req.url) {
        return parsed;
    } else {
        parsed = parse(req.url);

        if (parsed.auth && !parsed.protocol && ~parsed.href.indexOf('//')) {
            // This parses pathnames, and a strange pathname like //r@e should work
            parsed = parse(req.url.replace(/@/g, '%40'));
        }

        return req._parsedUrl = parsed;
    }
};

exports.gzipDir = function(dirPath, writable, emitter){
    var zlib = require('zlib').createGzip();
    fstream.Reader({
        "path" : dirPath,
        "type" : 'Directory'
    }).pipe(tar.Pack())
        .pipe(zlib)
        .pipe(writable);

    zlib.on('end', function(){
        writable.end();
        emitter.emit('free');
        console.log("over transfer gzip file "+dirPath);
    });
};