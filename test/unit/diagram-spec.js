const {create, from} = require('../../src/diagram');
const assert = require('assert');

describe('diagram test', function () {

    let diagram;

    describe('create a diagram retrive', function () {
        it('create', function () {
            diagram = create({
                channel: 'test-1'
            });

            assert.deepEqual(diagram, {
                id: 0, channel: 'test-1',
                request: undefined,
                response: undefined,
                status: 1 
            });
        });
    
        it('from', function () {
            const diagram = from({
                id: 1,
                channel: 'test-1'
            });

            assert.deepEqual(diagram, {
                id: 1, channel: 'test-1',
                request: undefined,
                response: undefined,
                status: undefined
            });
        });
    });

    describe('diagram retrive methods test', function () {
        describe('setRequest', function () {
            it('argument can be json stringify', function () {
                diagram.setRequest({
                    body: 'ok'
                });

                assert.deepEqual(diagram, {
                    id: 0, channel: 'test-1',
                    request: {
                        body: 'ok'
                    },
                    response: undefined,
                    status: 1 
                });

                diagram.setRequest();
            });

            it('argument can not be json stringify', function () {
                try {
                    diagram.setRequest(); //是对象，但是构造函数不是Object的
                } catch (e) {
                    assert.equal(e.message, 'Data can NOT be json stringi.');
                }
            });
        });

        describe('setResponse', function () {
            it('argument can be json stringify', function () {
                diagram.setResponse({
                    body: 'ok'
                });

                assert.deepEqual(diagram, {
                    id: 0, channel: 'test-1',
                    response: {
                        body: 'ok'
                    },
                    request: undefined,
                    status: 1 
                });

                diagram.setResponse();
            });

            it('argument can not be json stringify', function () {
                try {
                    diagram.setResponse(); //是对象，但是构造函数不是Object的
                } catch (e) {
                    assert.equal(e.message, 'Data can NOT be json stringi.');
                }
            });
        });

        describe('setStatus', function () {
            it('argument is a number', function () {
                diagram.setStatus(2);

                assert.deepEqual(diagram, {
                    id: 0, channel: 'test-1',
                    response: undefined,
                    request: undefined,
                    status: 2 
                });

                diagram.setStatus(1);
            });
            
            it('argument is not a number', function () {
                try {
                    diagram.setStatus();
                } catch (e) {
                    assert.equal(e.message, 'Status code MUST be a number.');
                }
            });
        });

        describe('toJSON', function () {
            it('the result of diagram retrive toJSON', function () {
                const jsonObj = diagram.toJSON();

                assert.deepEqual(jsonObj, {
                    id: 0, channel: 'test-1',
                    request: undefined,
                    response: undefined,
                    status: 1, protocol: 'pmc' 
                })
            });
        });
    });
});