const pmc = require('../src');

if (window.top === window.self) {
	let counter = 0;

	pmc.on('top.test', (datagram, source) => {
		counter++;
	});

	setTimeout(() => {
		console.log(counter);
	}, 5000);
}

pmc.on('frame.test', datagram => {
	console.log(datagram);
	// throw new Error('test')
	// pmc.request(window.top, 'top.test', Math.random());
	window.addEventListener.bind.call.d.d;
	return 'frame ok: ' + location.href;
});

window.onload = function () {
	
	const frameList = document.querySelectorAll('frame,iframe');

	const length = frameList.length;
	let counter = 0;

	for(let i = 0; i < length; i++) {
		pmc.request(frameList[i].contentWindow, 'frame.test', true).then(data => {
			console.log(data);
			counter++;
		});
	}

	// setTimeout(() => {
	// 	console.log(counter);
	// }, 2000);
}


// setTimeout(() => {
// 	pmc.request(window.top, 'test2', Math.random()).then(res => {
// 		console.log('res:', res)
// 	}, res => {
// 		console.log('res-error', res)
// 	});
// }, 2000);