const {on, request} = require('../src/index');
const {Promise} = require('../src/utils');

on('test.normal', function () {
    return true;
});

on('test.abnormal.custom', function () {
    throw new Error('throw an error.');
});

on('test.timeout', function () {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('successful.')
        }, 60000);
    })
});

on('test.syncIterative', function () {
    return 'iterative-call';
});

window.onbeforeunload = function () {
    request(top, 'test.unloadPage', 'closed', {
        async: false
    });
}