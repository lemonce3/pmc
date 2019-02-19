const {addEventListener, postMessage, isPlainObject, Promise} = require('../../src/utils');
const assert = require('assert');

describe('util test', function () {
    describe('postMessage', function () {
        it('postMessage execute once', function (done) {
            addEventListener(window, 'message', function (event) {
                const result = JSON.parse(event.data);

                if (result.protocol === 'pmc') {
                    return;
                }

                assert.deepEqual(result, {
                    result: 'success'
                });

                done();
            });

            postMessage(window, {
                result: 'success'
            });
        });
    });

    describe('isPlainObject', function () {
        it('arguments is an object', function () {
            assert.equal(isPlainObject({}), true);
        });

        it('arguments is not an object', function () {
            assert.equal(isPlainObject(1), false);
        });
    });
    
    describe('Promise', function () {
        it('promise resolve', function (done) {
            new Promise(function (resolve, reject) {
                resolve(3)
            }).then(function (data) {
                assert.equal(data, 3);

                done();
            });
        });

        it('promise reject', function (done) {
            new Promise(function (resolve, reject) {
                reject('test')
            }).then(function () {
            }, function (data) {
                assert.equal(data, 'test');

                done();
            });
        });
    });
});