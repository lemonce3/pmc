const {channelRegistry, on, off, request} = require('../../src/index');
const assert = require('assert');

describe('pmc test', function () {
    describe('method "on" test', function () {
        it('call "on" with handler is string', function () {
            assert.throws(function () {
                on('init', 'test');
            }, 'Handler should be a function.');
        });

        it('call "on" normally', function () {
            function init() {
                return 'successful.';
            }

            on('init', init)

            assert.deepEqual(channelRegistry['init'], init);
        });
    });

    describe('method "off" test', function () {
        it('delete channel "init"', function () {
            off('init');

            assert.equal(channelRegistry['init'], undefined);
        });
    });

    describe('method "request" test', function () {
        it('calling successfully', function (done) {
            request(f[0],'test.normal').then(function (data) {
                assert.deepEqual(data, true);

                done();
            });
        });

        it('calling abnormally', function (done) {
            request(f[0],'test.abnormal.custom').then(function () {}, function (data) {
                assert.throws(function () {
                    throw data;
                }, 'throw an error.');

                done();
            });
        });

        it('method unregistered', function (done) {
            request(f[0],'test._test_').then(function () {}, function (data) {
                assert.throws(function () {
                    throw data
                }, 'Channel not registered');

                done();
            });
        });
        
        it('synchronized iterative call method', function (done) {
            const array = new Array(1000).fill(1);
            let semaphore = 1;

            new Promise(function (resolve, reject) {

                array.forEach(function () {
                    request(f[0], 'test.syncIterative').then(function () {
                        if (semaphore < array.length) {
                            semaphore++;

                            return;
                        }

                        resolve(semaphore);
                    });
                });
            }).then(function (data) {
                assert.equal(data, array.length);

                done();
            });
        });

        it('calling timeout', function (done) {
            request(f[0],'test.timeout').then(function () {}, function (data) {
                assert.equal(data.message, 'Timeout (Unreachable)[test.timeout]')

                done();
            });
        }); 
    });
});