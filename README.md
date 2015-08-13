[![Build Status](https://travis-ci.org/ewngs/mongodb-helpers.svg?branch=master)](https://travis-ci.org/ewngs/mongodb-helpers)
# mongodb-helpers
Simple helper functions for mongodb

## Specification / Usage

```javascript
const test = require('tape');
const useObjectId = require('../lib/mongodb-helpers').useObjectId;

test('handles undefined value', t => {
    const result = useObjectId(undefined);

    t.ok(result === undefined);
    t.end();
});

test('handles simple string id', t => {
    const result = useObjectId('55af3dabd69361923fc86801');

    t.ok(result.id.length, 12);
    t.end();
});


test('handles simple object with _id field', t => {
    const document = {_id: '55af3dabd69361923fc86802'};
    const result = useObjectId(document);

    t.ok(result._id.id.length, 12);
    t.end();
});

test('handles simple object with given field', t => {
    const document = {type: '55af3dabd69361923fc86803'};
    const result = useObjectId(document, ['type']);

    t.ok(result.type.id.length, 12);
    t.end();
});

test('handles simple object with multiple given fields', t => {
    const document = {
        _id: '55af3dabd69361923fc86804',
        type: '55af3dabd69361923fc86805'
    };
    const result = useObjectId(document, ['_id', 'type']);

    t.ok(result._id.id.length, 12);
    t.ok(result.type.id.length, 12);
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

    t.ok(result._id.id.length, 12);
    t.ok(result.base.type.id.length, 12);
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

    t.ok(result._id.id.length, 12);
    t.ok(result.types[0].baseone._id.id.length, 12);
    t.ok(result.types[1].basetwo.subtypes[0].base._id.id.length, 12);
    t.end();
});
```
