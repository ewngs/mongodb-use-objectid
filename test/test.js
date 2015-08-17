'use strict';

const test = require('tape');
const useObjectId = require('../lib/mongodb-use-objectid');

test('wrap', function (wt) {

    wt.test('handles undefined value', t => {
        const result = useObjectId.wrap(undefined);

        t.equal(result, undefined);
        t.end();
    });

    wt.test('handles simple string id', t => {
        const result = useObjectId.wrap('55af3dabd69361923fc86801');

        t.equal(result.id.length, 12);
        t.end();
    });


    wt.test('handles simple object with _id field', t => {
        const document = {_id: '55af3dabd69361923fc86802'};
        const result = useObjectId.wrap(document);

        t.equal(result._id.id.length, 12);
        t.end();
    });

    wt.test('handles simple object with given field', t => {
        const document = {type: '55af3dabd69361923fc86803'};
        const result = useObjectId.wrap(document, ['type']);

        t.equal(result.type.id.length, 12);
        t.end();
    });

    wt.test('handles simple object with multiple given fields', t => {
        const document = {
            _id: '55af3dabd69361923fc86804',
            type: '55af3dabd69361923fc86805'
        };
        const result = useObjectId.wrap(document, ['_id', 'type']);

        t.equal(result._id.id.length, 12);
        t.equal(result.type.id.length, 12);
        t.end();
    });

    wt.test('handles deep object with multiple given fields', t => {
        const document = {
            _id: '55af3dabd69361923fc86804',
            base: {
                type: '55af3dabd69361923fc86805'
            }
        };
        const result = useObjectId.wrap(document, ['_id', 'base.type']);

        t.equal(result._id.id.length, 12);
        t.equal(result.base.type.id.length, 12);
        t.end();
    });

    wt.test('handles deep object with multiple given fields and arrays', t => {
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
        const result = useObjectId.wrap(document, ['_id', 'types.baseone._id', 'types.basetwo.subtypes.base._id']);

        t.equal(result._id.id.length, 12);
        t.equal(result.types[0].baseone._id.id.length, 12);
        t.equal(result.types[1].basetwo.subtypes[0].base._id.id.length, 12);
        t.end();
    });

    wt.test('should leave other properties as is', t => {
        const document = {
            _id: '55af3dabd69361923fc86804',
            arr: ['TestItem'],
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
        const result = useObjectId.wrap(document, ['_id', 'base.type']);

        t.equal(result.name, 'TestName');
        t.equal(result.arr[0], 'TestItem');
        t.equal(result.base.description, 'TestDescription');
        t.equal(result.spec.size, 5);
        t.equal(result.spec.items[0].name, 'item1');
        t.end();
    });

});
