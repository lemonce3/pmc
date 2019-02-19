const {addEventListener, postMessage, createDatagram, PMCError} = require('../../src/utils');
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

    describe('createDatagram', function () {
        it('execute "createDatagram" normally', function () {
            assert.deepEqual(createDatagram({
                id: 1, channel: 'test', status: '0', request: 'request', response: 'response'
            }), {
                id: 1, channel: 'test', status: '0', request: 'request', response: 'response', protocol: 'pmc'
            });
        });
        
        it('execute "createDatagram" with more than arguments', function () {
            assert.deepEqual(createDatagram({
                id: 1, channel: 'test', status: '0', request: 'request', response: 'response', protocol: 'test'
            }), {
                id: 1, channel: 'test', status: '0', request: 'request', response: 'response', protocol: 'pmc'
            })
        });

        it('execute "createDatagram" with less arguments', function () {
            assert.deepEqual(createDatagram({
                channel: '1'
            }), {
                id: 0, channel: '1', status: 1, request: undefined, response: undefined, protocol: 'pmc'
            })
        });
    });

    describe('PMCError', function () {
        it('execute "PMCError" normally', function () {
            assert.equal(PMCError(1, 'test', 'testChannel', 'testPMCError').message, 'Connecting (test)[testChannel] => testPMCError');
        });

        it('execute "PMCError" with no arguments', function () {
            assert.equal(PMCError().message, 'undefined (undefined)[undefined]');
        });

        it('execute "PMCError" with less arguments', function () {
            assert.equal(PMCError(1, 'test', 'testChannel').message, 'Connecting (test)[testChannel]');
        });
    });
    
});