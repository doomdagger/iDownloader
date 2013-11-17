/**
 * Created by Lihe on 13-11-15.
 */

var config = require('./config');
var utils = require('./utils');
var fs = require('fs');
var Hogan = require('hogan.js');

function Render(){
    this._cache = {};
    this.view_dir = utils.normalize(config.view_dir);
    this.view_ext = (config.view_ext[0]=='.')?config.view_ext:'.'+config.view_ext;
}

Render.prototype.render =  function(view_name, objects){
    var cache = this._cache;
    var me = this;
    view_name = (utils.extname(view_name))?view_name:view_name+this.view_ext;
    var view_path = utils.resolvePath(this.view_dir, view_name);

    var view_content = cache[view_path];

    if(!view_content){
        if(utils.exist(view_path)){
            var content = fs.readFileSync(view_path, 'utf8');
            cache[view_path] = content;
            return me._complile(content, objects);
        }else{
            return config.not_found_content;
        }

    }else{
        return me._complile(view_content, objects);
    }
}

Render.prototype._complile = function(content, objects){
    var template = Hogan.compile(content);
    return template.render(objects);
}

var render = new Render();

exports.render = render;