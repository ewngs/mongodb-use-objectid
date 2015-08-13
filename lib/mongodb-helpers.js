'use strict';

var bson = require('bson');

function matchingPaths(paths, prefix) {
    const result = paths.reduce((result, path) => {
        const pathParts = path.split('.');

        if (pathParts[0] !== prefix) {
            return result;
        }

        pathParts.shift();
        result.push(pathParts.join('.'));
        return result;
    }, []);

    return result;
}

/**
 * Replace string ids with objectId. Works for single string ids, simple document
 * objects and deep document objects containg arrays as well
 *
 * @param  {Object,String} document Document or single string id
 * @param  {Array}                    Array of property paths to replace
 * @return {Object,ObjectId}          New document or objectId
 */
function useObjectId(document, paths) {

    if (typeof document === 'string') {
        return bson.ObjectId(document);
    }

    if (typeof document !== 'object' || document === null) {
        return;
    }

    paths = paths || ['_id'];

    if (!Array.isArray(paths)) {
        throw new Error('The second parameter should be an array of propery paths');
    }

    //Walk and clone deeply also convert to ObjectId where its necesarry
    const result = Object.keys(document).reduce((result, key) => {

        //Handle simple string properties
        if (paths.indexOf(key) != -1 && typeof document[key] === 'string') {
            result[key] = bson.ObjectId(document[key]);
            return result;
        }

        //Handle sub objects
        if (typeof document[key] === 'object' && document[key] !== null) {
            const subPaths = matchingPaths(paths, key);
            //current key is part of given paths
            if (subPaths.length > 0) {
                result[key] = useObjectId(document[key], subPaths);
            }
        }

        //Handle arrays
        if (Array.isArray(document[key])) {
            const subPaths = matchingPaths(paths, key);
            //current key is part of given paths
            if (subPaths.length > 0) {
                result[key] = document[key].map(subDocument => {
                    return useObjectId(subDocument, subPaths);
                })
            }
        }

        return result;
    },{});

    return result;
}

module.exports = {
    useObjectId: useObjectId
}
