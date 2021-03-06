[![Build Status](https://travis-ci.org/ewngs/mongodb-use-objectid.svg?branch=master)](https://travis-ci.org/ewngs/mongodb-use-objectid)
# mongodb-use-objectid
Replace string ids with objectId. Works for single string ids, simple document objects and deep document objects containing arrays as well

## Specification / Usage

```javascript
const test = require('tape');
const useObjectId = require('../lib/mongodb-use-objectid');

test('handles undefined value', t => {
    const result = useObjectId(undefined);

    t.equal(result, undefined);
    t.end();
});

test('handles simple string id', t => {
    const result = useObjectId('55af3dabd69361923fc86801');

    t.equal(result.id.length, 12);
    t.end();
});


test('handles simple object with _id field', t => {
    const document = {_id: '55af3dabd69361923fc86802'};
    const result = useObjectId(document);

    t.equal(result._id.id.length, 12);
    t.end();
});

test('handles simple object with given field', t => {
    const document = {type: '55af3dabd69361923fc86803'};
    const result = useObjectId(document, ['type']);

    t.equal(result.type.id.length, 12);
    t.end();
});

test('handles simple object with multiple given fields', t => {
    const document = {
        _id: '55af3dabd69361923fc86804',
        type: '55af3dabd69361923fc86805'
    };
    const result = useObjectId(document, ['_id', 'type']);

    t.equal(result._id.id.length, 12);
    t.equal(result.type.id.length, 12);
    t.end();
});

test('handles deep object with multiple given fields', t => {
    const document = {
        _id: '55af3dabd69361923fc86804',
        base: {
            type: '55af3dabd69361923fc86805'
        }
    };
    const result = useObjectId(document, ['_id', 'base.type']);

    t.equal(result._id.id.length, 12);
    t.equal(result.base.type.id.length, 12);
    t.end();
});

test('handles deep object with multiple given fields and arrays', t => {
    const document = {
        _id: '55af3dabd69361923fc86804',
        types: [{
            baseone: {
                _id: '55af3dabd69361923fc86805'
            }
        }, {
            basetwo: {
                subtypes: [{
                    base: {
                        _id: '55af3dabd69361923fc86805'
                    }
                }]
            }
        }]
    };
    const result = useObjectId(document, ['_id', 'types.baseone._id', 'types.basetwo.subtypes.base._id']);

    t.equal(result._id.id.length, 12);
    t.equal(result.types[0].baseone._id.id.length, 12);
    t.equal(result.types[1].basetwo.subtypes[0].base._id.id.length, 12);
    t.end();
});

test('should leave other properties as is', t => {
    const document = {
        _id: '55af3dabd69361923fc86804',
        name: 'TestName',
        base: {
            description: 'TestDescription',
            type: '55af3dabd69361923fc86805'
        },
        spec: {
            size: 5,
            items: [
                {name: 'item1'}
            ]
        }
    };
    const result = useObjectId(document, ['_id', 'base.type']);

    t.equal(result.name, 'TestName');
    t.equal(result.base.description, 'TestDescription');
    t.equal(result.spec.size, 5);
    t.equal(result.spec.items[0].name, 'item1');
    t.end();
});
```
