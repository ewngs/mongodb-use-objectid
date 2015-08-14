'use strict';

var objectId = require('bson').ObjectId;

function matchingPaths(paths, prefix) {
    const result = paths.reduce((res, path) => {
        const pathParts = path.split('.');

        if (pathParts[0] !== prefix) {
            return res;
        }

        pathParts.shift();
        res.push(pathParts.join('.'));
        return res;
    }, []);

    return result;
}

/**
 * Replace string ids with objectId. Works for single string ids, simple document
 * objects and deep document objects containg arrays as well
 *
 * @param  {Object|String} document Document or single string id
 * @param  {Array}         paths    Array of property paths to replace
 * @return {Object|ObjectId}          New document or objectId
 */
function useObjectId(document, paths) {
    paths = paths || ['_id'];

    if (!Array.isArray(paths)) {
        throw new Error('The second parameter should be an array of propery paths');
    }

    if (typeof document === 'string') {
        return objectId(document);
    }

    if (Array.isArray(document)) {
        return document.map(subDocument => {
            return useObjectId(subDocument, paths);
        });
    }

    if (typeof document !== 'object' || document === null) {
        return document;
    }

    //Walk and clone deeply also convert to ObjectId where its necesarry
    const result = Object.keys(document).reduce((res, key) => {
        //Handle simple string properties
        if (typeof document[key] === 'string' && paths.indexOf(key) === -1) {
            res[key] = document[key];
            return res;
        }

        //Handle other
        const subPaths = matchingPaths(paths, key);
        res[key] = useObjectId(document[key], subPaths);

        return res;
    }, {});

    return result;
}

module.exports = useObjectId;
