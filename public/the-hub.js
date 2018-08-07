var connections = []; // count active connections
var messages = [];

self.addEventListener("connect", function (e) {

	connections.push(e.ports[0]);
	let connectionNo = connections.length;

	postConnectionCount();

	connections[connections.length -1].addEventListener("message", function (e) {
		switch (true) {
			case e.data.channel == 'message':
				postToAll(e, connectionNo);
				break;

			case e.data.channel == 'close':
				closeSlaves();
				break;
		
			case e.data.channel == 'slave-pos':
				sendSlavePos(e);
				break;
			default:
				break;
		}
	}, false);

	connections[connections.length -1].start();

}, false);

function postConnectionCount() {
	self.connections.forEach(port => {
		port.postMessage({channel: 'connections', content: connections.length });
		port.postMessage({channel: 'messages', content: messages});
	});
}

function closeSlaves() {
	self.connections.forEach(port => {
		port.postMessage({ channel: 'close' });
	});
	connections.splice(1, connections.length-1);
	postConnectionCount();
}

function postToAll(e, connectionNo) {
	let message = "Note: " + e.data.content;
	messages.push(message);
	self.connections.forEach(port => {
		port.postMessage({channel: 'messages', content: messages});
	});
}

function sendSlavePos(e) {
	self.connections.forEach(port => {
		port.postMessage({channel: 'slave-pos', content: e.data.content});
	});
}