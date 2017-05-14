module.exports.pager = function(page, requestedlimit, defaultLimit, maxLimit, callback){
    var skip, limit;
    limit = limiter(requestedlimit, defaultLimit, maxLimit);

    if(!page){
        page = 0;
    }

    skip = page * limit;

    callback(skip, limit);
};

function limiter(limit, defaultLimit, maxLimit){
    if (!limit) {
        limit = defaultLimit;
    }
    if (limit > maxLimit) {
        limit = maxLimit;
    }
    return limit;
}

module.exports.limiter = limiter;