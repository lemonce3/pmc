const {on, off, request} = require('../../src/index');
const assert = require('assert');

describe('pmc test', function () {
    describe('method "on" test', function () {
        it('call "on" with name not existed', function () {
            on('init', 'test');

            assert.equal(c['init'], 'test');
        });

        it('call "on" with name existed', function () {
            on('init', 'init');

            assert.deepEqual(c['init'], 'init');
        });
    });

    describe('method "off" test', function () {
        it('delete channel "init"', function () {
            off('init');

            assert.equal(c['init'], undefined);
        });
    });

    describe('method "request" test', function () {
        it('calling successfully', function (done) {
            request(f[0],'test.normal').then(function (data) {
                assert.deepEqual(getResult(data), {
                    channel: 'test.normal',
                    request: undefined,
                    response: true,
                    status: 0
                });

                done();
            });
        });

        it('calling abnormally', function (done) {
            request(f[0],'test.abnormal.custom').then(function () {}, function (data) {
                assert.deepEqual(getResult(data), {
                    channel: 'test.abnormal.custom',
                    request: undefined,
                    response: 'throw an error.',
                    status: 128
                });

                done();
            });
        });

        it('calling abnormally with call non function', function (done) {
            request(f[0],'test.abnormal.notFunction').then(function () {}, function (data) {
                const {channel, request,status} = data;

                assert.deepEqual({
                    channel, request, status
                }, {
                    channel: 'test.abnormal.notFunction',
                    request: undefined,
                    status: 128
                });

                done();
            });
        });

        it('method unregistered', function (done) {
            request(f[0],'test._test_').then(function () {}, function (data) {
                assert.deepEqual(getResult(data), {
                    channel: 'test._test_',
                    request: undefined,
                    response: 'Unregistered handler',
                    status: 3
                });

                done();
            });
        });
        
        it('synchronized iterative call method', function () {
            f.forEach(function (iframe) {
                request(iframe, 'test.normal').then(function (data) {
                    console.log(3);
                });

                console.log(1);
            });

            console.log(4);
        });

        it('calling timeout', function (done) {
            request(f[0],'test.timeout').then(function () {}, function (data) {
                assert.deepEqual(getResult(data), {
                    channel: 'test.timeout',
                    request: undefined,
                    response: undefined,
                    status: 4
                });

                done();
            });
        }); 
    });
});

function getResult({channel, request, response, status}) {
    return {
        channel, request, response, status
    }
}