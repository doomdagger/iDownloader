/**
 * Created by apple on 13-11-14.
 */


var Route = require("./route");
var staticRoute = require("./static_route").staticRoute;
var config = require('./config');
var util = require('util');
var utils = require("./utils");

function Router(){
    this.routes = [];
    this._init();
}

Router.prototype._init = function(){
    for(var ix = 0; ix < config.concurrent_num; ++ix){
        this.routes[ix] = new Route();
    }
};

Router.prototype.assign = function(req, res){
    console.log(util.inspect(req.headers)+"\n"+req.url);
    utils.parseUrl(req);
    //console.log(req._parsedUrl.pathname);
    if(staticRoute.matchRequest(req, res)){
        return;
    }

    var ix = 0;
    while(true){
        //console.log('find free route...');
        if(!this.routes[ix].busy){
            console.log('find one!!! index='+ix);
            this.routes[ix].handle(req, res);
            break;
        }
        ix = (++ix)%config.concurrent_num;
    }

    //var route = new Route();
    //route.handle(req, res);
};


module.exports = Router;