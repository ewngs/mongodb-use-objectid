'use strict';

var mongodb = require('mongodb-core');
var merge = require('merge');


/**
 * Replace document string id with objectId. Also works for single string id
 * @param  {Object,String} document Document or single string id
 * @return {Object,ObjectId}          New document or objectId
 */
function useObjectId(document) {
    if (typeof document === 'string') {
        return mongodb.BSON.ObjectId(document);
    }

    var result = merge(true, document);

    if (document._id) {
        result._id = mongodb.BSON.ObjectId(document._id);
    }

    return result;
}

module.exports = {
    useObjectId: useObjectId
}
