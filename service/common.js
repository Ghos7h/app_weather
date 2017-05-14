(function (common) {
	var request = require('request');
	common.get = function(url, headers, callback){
        var options = {
            url: url,
            headers: headers,
            method:'GET'
        };
        request(options, callback);
    };
})(module.exports);