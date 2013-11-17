/**
 * Created by apple on 13-11-14.
 */

var fs = require("fs");

/*
    options  start, end, flags:'r'
 */
function Downloader(path, options){
    this.path = path;
    this.readable = fs.createReadStream(path, options);
}

Downloader.prototype.download = function(writable, route){
    var readable = this.readable;
    var path = this.path;
    readable.pipe(writable);
    readable.on("error", function(){
        console.log("error occurred while downloading the file at '"+path+"'");
    });
    readable.on("end", function(){
        readable.unpipe(writable);
        writable.end();
        console.log("file '"+path+"' finished downloading...");
    });
    readable.on("close", function(){
        route.emit('free');
        //readable.unpipe(writable);
        //writable.end();
        //console.log("file '"+path+"' stopped downloading...");
    });
};

module.exports = Downloader;