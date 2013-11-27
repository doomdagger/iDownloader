/**
 * Created by apple on 13-11-13.
 */

var config = {
    "root_dir" : "D:\\Developer\\TDDOWNLOAD",
    "view_dir" : "..\\views",
    "view_ext" : ".html",
    "static_dir" : "..\\static",
    "concurrent_num" : 300,
    "valid_query_key" : ["option"],
    "not_found_content": "<h1>404</h1><h4>Sorry, the resource you are looking for cannot be found! Click <a href='/'>here</a> to go to root path!</h4>",
    "internal_error_content": "<h1>500</h1><h4>Sorry, the server encounters a problem! Click <a href='/'>here</a> to go to root path!</h4>"
};


module.exports = config;
